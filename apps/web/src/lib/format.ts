export function formatArea(m2: number | null | undefined): string {
	if (m2 == null) return '—';
	return `${m2} m²`;
}

export function formatPlot(width: number | null, depth: number | null): string {
	if (width == null || depth == null) return '—';
	return `${width}×${depth} m`;
}

export function formatDate(ms: number): string {
	return new Intl.DateTimeFormat('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(ms);
}
