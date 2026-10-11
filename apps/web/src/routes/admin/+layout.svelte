<script lang="ts">
	import { page } from '$app/state';
	import { api } from '#lib/api';
	import { goto } from '$app/navigation';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	async function logout() {
		await api('/api/auth/logout', { method: 'POST', body: '{}' });
		await goto('/admin', { invalidateAll: true });
	}

	function current(href: string) {
		return page.url.pathname === href || (href !== '/admin' && page.url.pathname.startsWith(href));
	}
</script>

{#if data.authed}
	<div class="admin-shell">
		<aside class="admin-side">
			<a href="/" style="opacity:0.6;font-size:0.8rem">← Xem site</a>
			<p style="margin: 1rem 0 0.4rem; font-weight: 700; font-size: 1.15rem">TKT Admin</p>
			<a href="/admin" aria-current={current('/admin') && page.url.pathname === '/admin' ? 'page' : undefined}
				>Tổng quan</a
			>
			<a href="/admin/du-an" aria-current={current('/admin/du-an') ? 'page' : undefined}>Dự án</a>
			<a href="/admin/lien-he" aria-current={current('/admin/lien-he') ? 'page' : undefined}>Hộp thư</a>
			<button class="btn ghost" style="margin-top:1.5rem" type="button" onclick={logout}
				>Đăng xuất</button
			>
		</aside>
		<div class="admin-main">{@render children()}</div>
	</div>
{:else}
	<div class="section">
		<div class="wrap" style="max-width: 420px; padding-top: 4rem">
			{@render children()}
		</div>
	</div>
{/if}
