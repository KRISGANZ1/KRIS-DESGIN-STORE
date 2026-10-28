export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits.startsWith("8")
      ? `62${digits}`
      : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(order: {
  order_number: string;
  product: string;
  quantity: number;
  total_amount: number;
}, storeName: string): string {
  return `Halo ${storeName}, saya ingin konfirmasi pesanan ${order.order_number}. Produk: ${order.product}. Jumlah: ${order.quantity}. Total pembayaran: Rp${new Intl.NumberFormat("id-ID").format(order.total_amount)}.`;
}
