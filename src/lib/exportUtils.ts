import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageOrientation,
} from "docx";
import { IProduct } from "@/types/product";

export function exportToExcel(products: IProduct[], customFileName?: string) {
  if (!products || products.length === 0) {
    alert("ไม่พบข้อมูลครุภัณฑ์สำหรับการส่งออก");
    return;
  }

  const data = products.map((item, index) => ({
    "ลำดับ": index + 1,
    "หมายเลขครุภัณฑ์": item.num1 || "-",
    "รายการครุภัณฑ์": item.name || "-",
    "คุณลักษณะ / สเปค": item.spec || "-",
    "จำนวน": Number(item.num2 || 1),
    "ราคาต่อหน่วย (บาท)": Number(item.price || 0),
    "ราคารวม (บาท)": Number(item.price || 0) * Number(item.num2 || 1),
    "สถานที่ใช้งาน": item.building || "-",
    "ผู้รับผิดชอบ": item.respondent || "-",
    "วิธีการจัดหา": item.method || "-",
    "งบประมาณ": item.budget || "-",
    "ประเภทครุภัณฑ์": item.category || "-",
    "กลุ่มครุภัณฑ์": item.group || "-",
    "สถานะ": item.stat || "ปกติ",
    "วันที่ได้มา": item.date1 || "-",
    "ปีที่จัดซื้อ": item.date2 || "-",
    "วันที่ตรวจเช็คล่าสุด": item.lastCheckedDate || "-",
    "หมายเหตุการตรวจเช็ค": item.checkNote || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // ตั้งค่าความกว้างของคอลัมน์ให้อ่านง่าย
  worksheet["!cols"] = [
    { wch: 8 },  // ลำดับ
    { wch: 22 }, // หมายเลขครุภัณฑ์
    { wch: 35 }, // รายการครุภัณฑ์
    { wch: 30 }, // คุณลักษณะ
    { wch: 10 }, // จำนวน
    { wch: 18 }, // ราคา
    { wch: 18 }, // ราคารวม
    { wch: 20 }, // สถานที่
    { wch: 22 }, // ผู้รับผิดชอบ
    { wch: 16 }, // วิธีการจัดหา
    { wch: 20 }, // งบประมาณ
    { wch: 20 }, // ประเภท
    { wch: 22 }, // กลุ่ม
    { wch: 12 }, // สถานะ
    { wch: 14 }, // วันที่ได้มา
    { wch: 12 }, // ปีที่จัดซื้อ
    { wch: 22 }, // ตรวจเช็คล่าสุด
    { wch: 25 }, // หมายเหตุ
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ทะเบียนครุภัณฑ์");

  const dateStr = new Date().toISOString().split("T")[0];
  const fileName = customFileName || `รายงานครุภัณฑ์_คณะมนุษยศาสตร์_${dateStr}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export async function exportToWord(products: IProduct[], customFileName?: string) {
  if (!products || products.length === 0) {
    alert("ไม่พบข้อมูลครุภัณฑ์สำหรับการส่งออก");
    return;
  }

  const dateStr = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cellBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  };

  // Header Row
  const tableHeaders = [
    "ลำดับ",
    "หมายเลขครุภัณฑ์",
    "รายการครุภัณฑ์",
    "จำนวน",
    "ราคา (บาท)",
    "สถานที่ใช้งาน",
    "ผู้รับผิดชอบ",
    "สถานะ",
    "ตรวจเช็คล่าสุด",
  ];

  const headerRow = new TableRow({
    tableHeader: true,
    children: tableHeaders.map(
      (headerText) =>
        new TableCell({
          borders: cellBorder,
          shading: { fill: "E2F5EA" }, // สีเขียวอ่อนเข้ากับธีม
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: headerText,
                  bold: true,
                  size: 18, // 9pt
                  font: "Kanit",
                }),
              ],
            }),
          ],
        })
    ),
  });

  // Data Rows
  const dataRows = products.map((item, index) => {
    return new TableRow({
      children: [
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: String(index + 1), size: 16, font: "Kanit" }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.num1 || "-",
                  bold: true,
                  size: 16,
                  font: "Kanit",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: item.name || "-", size: 16, font: "Kanit" }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: String(item.num2 || 1),
                  size: 16,
                  font: "Kanit",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: Number(item.price || 0).toLocaleString(),
                  size: 16,
                  font: "Kanit",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.building || "-",
                  size: 16,
                  font: "Kanit",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.respondent || "-",
                  size: 16,
                  font: "Kanit",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: item.stat || "ปกติ",
                  bold: true,
                  size: 16,
                  font: "Kanit",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorder,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: item.lastCheckedDate || "-",
                  size: 16,
                  font: "Kanit",
                }),
              ],
            }),
          ],
        }),
      ],
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "รายงานทะเบียนและสถานะครุภัณฑ์",
                bold: true,
                size: 32, // 16pt
                font: "Kanit",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "คณะมนุษยศาสตร์และสังคมศาสตร์ มหาวิทยาลัยราชภัฏจันทรเกษม",
                size: 24, // 12pt
                font: "Kanit",
                color: "555555",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `ข้อมูล ณ วันที่ ${dateStr} | จำนวนรายการทั้งหมด: ${products.length} รายการ`,
                size: 20, // 10pt
                font: "Kanit",
                color: "777777",
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...dataRows],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  const fileName =
    customFileName ||
    `รายงานครุภัณฑ์_คณะมนุษยศาสตร์_${new Date().toISOString().split("T")[0]}.docx`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export async function exportToPdf(products: IProduct[], customFileName?: string) {
  if (!products || products.length === 0) {
    alert("ไม่พบข้อมูลครุภัณฑ์สำหรับการส่งออก");
    return;
  }

  // Dynamic import เพื่อ load เฉพาะเมื่อเรียกใช้งานจริง (ลดขนาด initial bundle)
  const jspdfModule = await import("jspdf");
  const jsPDF = jspdfModule.default;
  await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const dateStr = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Header ชื่อเรื่อง
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Equipment Management Report", 148.5, 16, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Faculty of Humanities and Social Sciences, Chandrakasem Rajabhat University", 148.5, 23, { align: "center" });
  doc.text(`Date: ${dateStr} | Total: ${products.length} items`, 148.5, 29, { align: "center" });
  doc.setTextColor(0, 0, 0);

  const tableHeaders = [
    ["#", "ID Number", "Equipment Name", "Qty", "Price (THB)", "Location", "Responsible", "Status", "Last Checked"],
  ];

  const tableData = products.map((item, index) => [
    String(index + 1),
    item.num1 || "-",
    item.name || "-",
    String(item.num2 || 1),
    Number(item.price || 0).toLocaleString(),
    item.building || "-",
    item.respondent || "-",
    item.stat || "ปกติ",
    item.lastCheckedDate || "-",
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc as any).autoTable({
    head: tableHeaders,
    body: tableData,
    startY: 34,
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      overflow: "linebreak",
      lineColor: [200, 200, 200],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [6, 95, 70],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [240, 253, 244],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { cellWidth: 32 },
      2: { cellWidth: 55 },
      3: { halign: "center", cellWidth: 12 },
      4: { halign: "right", cellWidth: 25 },
      5: { cellWidth: 30 },
      6: { cellWidth: 28 },
      7: { halign: "center", cellWidth: 18 },
      8: { halign: "center", cellWidth: 30 },
    },
    didDrawPage: (hookData: any) => {
      // Footer with page number
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${hookData.pageNumber} of ${pageCount} | Equipment Management System`,
        148.5,
        doc.internal.pageSize.getHeight() - 5,
        { align: "center" }
      );
      doc.setTextColor(0, 0, 0);
    },
  });

  const dateISO = new Date().toISOString().split("T")[0];
  const fileName = customFileName || `รายงานครุภัณฑ์_คณะมนุษยศาสตร์_${dateISO}.pdf`;
  doc.save(fileName);
}

