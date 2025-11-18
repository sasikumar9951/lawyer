**Statement of Work (SOW)**

**Project Title:** Legal Consultancy Platform Development

**Date:** 06/08/2025

---

### **1\. Project Overview**

To design and develop a professional legal consultancy platform where users can purchase legal services, schedule appointments with lawyers, and communicate securely. This will be a web-only solution inspired by www.legalkart.com with simplified MVP features to ensure scalability in future phases.

---

### **2\. Key Deliverables**

* Responsive and SEO-optimized website using **Next.js**, **TypeScript**, **PostgreSQL**, and **Prisma**.  
* Three dashboards:  
  * **User Panel** (account creation to access past meetings, new appointments, and stats)  
  * **Lawyer Panel** (created and managed by Admin)  
  * **Admin Panel** (full access and control)  
* Secure payment integration (Razorpay – credentials provided by client).  
* WhatsApp communication via **Twilio API** (templates & business account by client).  
* Custom in-app **Form Builder** (conditional logic supported).  
* Third-party **meeting platform** integration (e.g. Twilio Video (preferred over Daily.co due to better integration, time-limit controls, and future scalability)).  
* One central **backend server**.  
* One-month free hosting.  
* AWS S3 integration for secure file upload and storage.

---

### **3\. Functional Breakdown**

#### **A. Services Flow**

User creates an account → Fills form → Uploads documents (stored in AWS S3) → Makes payment → Admin receives inquiry and views user submission → Lawyer reaches out to Admin → Admin creates Lawyer account → Admin manually assigns lawyer to user (no auto assignment logic) → Admin sends WhatsApp notifications to both → Meeting link generated via Twilio Video (preferred over Daily.co due to better integration, time-limit controls, and future scalability) and shared → Lawyer and client attend consultation → Admin updates status manually or it is auto-updated based on event triggers

#### **B. Features**

* Professional UI/UX  
* Full mobile responsiveness  
* SEO Metadata setup \+ Google Analytics integration  
* Dynamic form creation and editability by admin or lawyer (will be finalized in meeting)  
* Manual lawyer-client assignment by admin  
* Call time limit via Twilio Video (preferred over Daily.co due to better integration, time-limit controls, and future scalability)  
* All messages through WhatsApp will follow approved template logic

---

### **4\. Meeting & Update Schedule**

* **Weekly Major Update**: Summary and progress video/screenshots  
* **Every 3–4 Days Minor Update**: Dev status, blockers, UI progress  
* **Meetings**: Twice per week (Zoom/Twilio Video (preferred over Daily.co due to better integration, time-limit controls, and future scalability)) – time to be agreed mutually

---

### **5\. Step-by-Step Execution Plan**

* Finalize requirements and design structure  
* Develop User and Lawyer Panel frontend  
* Build Admin dashboard functionality  
* Integrate Razorpay, Twilio WhatsApp, AWS S3, and Twilio Video (preferred over Daily.co due to better integration, time-limit controls, and future scalability) (Each service should be provided by client , delay in the service might delay the development flow. )  
* Implement dynamic Form Builder with conditional logic  
* Add SEO metadata, connect GA, test site responsiveness  
* Perform internal QA and finalize deployment  
* Launch with free 1-month hosting and deliver full source code

### **6\. Exclusions**

* No native mobile app  
* No real-time chat  
* Costs excluded: domain, server infra, APIs, WhatsApp/Twilio, payment gateway setup

---

### **7\. Commercials & Terms**

* Full source code handed over  
* Clean, maintainable codebase  
* One month of free hosting support  
* All credentials & 3rd-party accounts to be provided by client  
* MVP delivery targeted within **30 days**, subject to timely feedback  
* If additional features are requested, both time and cost will increase accordingly

---

**End-to-End Flow Summary**

1. User creates account and submits form \+ docs (stored on AWS S3)  
2. Admin views the inquiry  
3. Lawyer reaches out to Admin  
4. Admin creates Lawyer account manually  
5. Admin assigns Lawyer to the user (manual assignment)  
6. Admin sends WhatsApp notifications to both client and lawyer  
7. Meeting link is sent via WhatsApp using Twilio Video (preferred over Daily.co due to better integration, time-limit controls, and future scalability)  
8. Lawyer and client connect via Twilio Video (preferred over Daily.co due to better integration, time-limit controls, and future scalability) link  
9. Admin manually or auto-updates the service status based on the action

