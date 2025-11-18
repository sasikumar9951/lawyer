import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

const buildExcel = async (rows: Array<Record<string, string | number>>) => {
  const headers = Object.keys(rows[0] || {});

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Lawyers");

  // Add company logo in the header (centered, positioned at row 2)
  try {
    const logoPath = path.join(process.cwd(), "public", "bgg.png");
    if (fs.existsSync(logoPath)) {
      const imageId = workbook.addImage({
        filename: logoPath,
        extension: "png",
      });

      // Add logo to the worksheet (centered, positioned at row 2, spanning A-E)
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 1 },
        ext: { width: 200, height: 60 },
      });
    }
  } catch (error) {
    console.error("Error adding logo to Excel:", error);
  }

  // Add empty row for logo positioning
  const titleRow = worksheet.addRow([]);
  titleRow.height = 40;

  // Add empty rows for spacing
  // worksheet.addRow([]);
  // worksheet.addRow([]);

  // Add headers
  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF0F0F0" },
  };

  // Add data rows
  rows.forEach((row) => {
    const dataRow = worksheet.addRow(Object.values(row));
  });

  // Auto-size columns
  worksheet.columns.forEach((column) => {
    column.width = Math.max(
      column.header?.length || 10,
      ...rows.map(
        (row) =>
          String(Object.values(row)[worksheet.columns.indexOf(column)] || "")
            .length
      )
    );
  });

  // Generate buffer
  return await workbook.xlsx.writeBuffer();
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== null && isActive !== undefined && isActive !== "") {
      whereClause.isActive = isActive === "true";
    }

    const lawyers = await prisma.lawyer.findMany({
      where: whereClause,
      include: {
        cases: {
          select: { id: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const rows = lawyers.map((lawyer, index) => {
      const total = lawyer.cases.length;
      const pending = lawyer.cases.filter((c) => c.status === "PENDING").length;
      const inProgress = lawyer.cases.filter(
        (c) => c.status === "IN_PROGRESS"
      ).length;
      const completed = lawyer.cases.filter(
        (c) => c.status === "COMPLETED"
      ).length;
      const cancelled = lawyer.cases.filter(
        (c) => c.status === "CANCELLED"
      ).length;

      return {
        "S.No": index + 1,
        Name: lawyer.name,
        Email: lawyer.email,
        Phone: lawyer.phone ?? "",
        Languages: (lawyer.languages || []).join("; "),
        ActiveCases: inProgress,
        PendingCases: pending,
        CompletedCases: completed,
        CancelledCases: cancelled,
        TotalCases: total,
        Status: lawyer.isActive ? "Active" : "Inactive",
      } as Record<string, string | number>;
    });

    const excelBuffer = await buildExcel(rows);

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=lawyers_export.xlsx`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error exporting lawyers Excel:", error);
    return NextResponse.json(
      { error: "Failed to export Excel" },
      { status: 500 }
    );
  }
};
