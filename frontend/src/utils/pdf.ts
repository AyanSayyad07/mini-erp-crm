import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (challan: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(99, 102, 241); // Indigo color
  doc.text('SALES INVOICE', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(`Invoice Number: ${challan.challan_number}`, 14, 32);
  doc.text(`Date Issued: ${new Date(challan.created_at).toLocaleDateString()}`, 14, 37);
  doc.text(`Status: ${challan.status}`, 14, 42);
  
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('Billed To:', 14, 55);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Customer Name: ${challan.customer_name || 'N/A'}`, 14, 62);
  doc.text(`Mobile: ${challan.mobile || 'N/A'}`, 14, 67);

  const tableData = challan.items.map((i: any) => [
    i.product_name_snapshot,
    `$${Number(i.unit_price_snapshot).toFixed(2)}`,
    i.quantity,
    `$${(Number(i.unit_price_snapshot) * i.quantity).toFixed(2)}`
  ]);

  const totalAmount = challan.items.reduce((sum: number, i: any) => sum + (Number(i.unit_price_snapshot) * i.quantity), 0);

  autoTable(doc, {
    startY: 80,
    head: [['Product Description', 'Unit Price', 'Qty', 'Subtotal']],
    body: tableData,
    foot: [['', '', 'Total:', `$${totalAmount.toFixed(2)}`]],
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] },
    footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42] }
  });

  doc.save(`Invoice_${challan.challan_number}.pdf`);
};
