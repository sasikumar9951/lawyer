"use client";

import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  FolderTree,
  CornerDownRight,
  PlusCircle,
  Trash2, // Delete icon
  AlertTriangle, // Warning icon for delete dialog
} from "lucide-react";
import {
  ApiServiceCategory,
  ApiServiceSubCategory,
} from "@/types/api/services";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ApiServiceCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Create/Edit Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [creationType, setCreationType] = useState<"CATEGORY" | "SUB_CATEGORY">(
    "CATEGORY"
  );
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Dialog State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
    type: "CATEGORY" | "SUB_CATEGORY";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/services/categories");
      const data = await response.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Handlers for Create/Edit ---

  // 1. Handle "Edit" Click
  const handleEditClick = (
    item: ApiServiceCategory | ApiServiceSubCategory,
    type: "CATEGORY" | "SUB_CATEGORY",
    parentId: string = ""
  ) => {
    setEditingId(item.id);
    setName(item.name);
    setCreationType(type);
    setSelectedParentId(parentId);
    setIsCreateOpen(true);
  };

  // 2. Handle "Add Sub-Category" Click (from Row - Image 1 request)
  const handleAddSubCategoryClick = (parentId: string) => {
    setEditingId(null);
    setName("");
    setCreationType("SUB_CATEGORY"); // Automatically set type to Sub-Category
    setSelectedParentId(parentId); // Automatically select the parent
    setIsCreateOpen(true);
  };

  // 3. Handle "Create New" Click (Top Button - Image 2 request)
  const handleCreateNewClick = () => {
    setEditingId(null);
    setName("");
    setCreationType("CATEGORY"); // Automatically set type to Main Category
    setSelectedParentId("");
    setIsCreateOpen(true);
  };

  // 4. Submit Logic (Create/Update)
  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (creationType === "SUB_CATEGORY" && !selectedParentId) {
      alert("Please select a parent category for the sub-category.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        type: creationType,
        parentId:
          creationType === "SUB_CATEGORY" ? selectedParentId : undefined,
        id: editingId,
      };

      // Assuming POST handles both create and update (upsert logic in backend)
      const response = await fetch("/api/admin/services/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await fetchCategories();
        handleCloseDialog();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    setName("");
    setCreationType("CATEGORY");
    setSelectedParentId("");
    setEditingId(null);
  };

  // --- Handlers for Delete (Image 3 request) ---

  const handleDeleteClick = (
    item: ApiServiceCategory | ApiServiceSubCategory,
    type: "CATEGORY" | "SUB_CATEGORY"
  ) => {
    setItemToDelete({ id: item.id, name: item.name, type });
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      // Note: You need to implement the DELETE method in your API route
      const response = await fetch("/api/admin/services/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemToDelete.id, type: itemToDelete.type }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchCategories(); // Refresh data
        setIsDeleteOpen(false);
        setItemToDelete(null);
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete item.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewClick = (slug: string) => {
    window.open(`/services/${slug}`, "_blank");
  };

  // Filter Logic
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subCategories.some((sub) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderTree className="w-8 h-8 text-primary" /> Categories
          </h1>
          <p className="text-gray-500">
            Manage service categories and sub-categories
          </p>
        </div>

        {/* Main "Add New" Button (Opens dialog for Main Category) */}
        <Button onClick={handleCreateNewClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" /> Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Hierarchical view of categories and sub-categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[40%]">Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center h-24 text-gray-500"
                    >
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <Fragment key={category.id}>
                      {/* Main Category Row */}
                      <TableRow className="bg-white hover:bg-gray-50/50 group">
                        <TableCell className="font-semibold text-gray-900">
                          {category.name}
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {category.slug}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Main
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                            {/* ⭐ Add Sub-Category Button (Green) */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleAddSubCategoryClick(category.id)
                              }
                              title="Add Sub-Category"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 font-medium"
                            >
                              <PlusCircle className="w-4 h-4 mr-1" />
                              <span className="text-xs hidden sm:inline">
                                Sub-Category
                              </span>
                            </Button>

                            {/* View Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewClick(category.slug)}
                              title="View Public Page"
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </Button>

                            {/* Edit Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleEditClick(category, "CATEGORY")
                              }
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 text-blue-500" />
                            </Button>

                            {/* ⭐ Delete Button (Red) */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteClick(category, "CATEGORY")
                              }
                              title="Delete"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Sub-Categories Rows */}
                      {category.subCategories.map((sub) => (
                        <TableRow
                          key={sub.id}
                          className="bg-gray-50/30 hover:bg-gray-50"
                        >
                          <TableCell className="pl-8 flex items-center text-gray-600 font-medium">
                            <CornerDownRight className="w-4 h-4 mr-2 text-gray-400" />
                            {sub.name}
                          </TableCell>
                          <TableCell className="text-gray-400 text-xs">
                            {sub.slug}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Sub
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {/* View Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewClick(sub.slug)}
                              >
                                <Eye className="w-4 h-4 text-gray-400" />
                              </Button>

                              {/* Edit Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditClick(
                                    sub,
                                    "SUB_CATEGORY",
                                    sub.categoryId
                                  )
                                }
                              >
                                <Pencil className="w-4 h-4 text-blue-400" />
                              </Button>

                              {/* ⭐ Delete Button (Red) */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteClick(sub, "SUB_CATEGORY")
                                }
                                title="Delete"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ==================== Dialogs ==================== */}

      {/* Create / Edit Dialog */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Category" : "Create New"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update details"
                : "Add a Main Category or a Sub-Category."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Type Selection - Disabled if editing specific type or clicking specific add button */}
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-4">
                <div
                  className={`flex-1 border rounded-md p-3 cursor-pointer text-center transition-colors ${creationType === "CATEGORY" ? "bg-primary/10 border-primary font-medium text-primary" : "hover:bg-gray-50"} ${editingId || creationType === "SUB_CATEGORY" ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => !editingId && setCreationType("CATEGORY")}
                >
                  Main Category
                </div>
                <div
                  className={`flex-1 border rounded-md p-3 cursor-pointer text-center transition-colors ${creationType === "SUB_CATEGORY" ? "bg-primary/10 border-primary font-medium text-primary" : "hover:bg-gray-50"} ${editingId || creationType === "CATEGORY" ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => !editingId && setCreationType("SUB_CATEGORY")}
                >
                  Sub-Category
                </div>
              </div>
            </div>

            {/* Parent Selection (Only for Sub-Category) */}
            {creationType === "SUB_CATEGORY" && (
              <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <Label>Select Parent Category</Label>
                <Select
                  value={selectedParentId}
                  onValueChange={setSelectedParentId}
                  disabled={!!editingId || !!selectedParentId}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select parent..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  creationType === "CATEGORY"
                    ? "e.g. Corporate Law"
                    : "e.g. Pvt Ltd Registration"
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !name.trim()}
              >
                {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog (Image 3 style) */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete{" "}
              {itemToDelete?.type === "CATEGORY" ? "Category" : "Sub-Category"}?
            </DialogTitle>
            <DialogDescription className="py-3">
              Are you sure you want to delete{" "}
              <strong>"{itemToDelete?.name}"</strong>?
              {itemToDelete?.type === "CATEGORY" && (
                <span className="block mt-2 text-red-500 font-medium">
                  Warning: Deleting a main category will also delete all its
                  sub-categories and associated services!
                </span>
              )}
              {itemToDelete?.type === "SUB_CATEGORY" && (
                <span className="block mt-2 text-red-500 font-medium">
                  Warning: Deleting this sub-category will affect services
                  linked to it.
                </span>
              )}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
