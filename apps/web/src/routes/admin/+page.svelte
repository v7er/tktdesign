<script lang="ts">
	import { goto } from '$app/navigation';
	import { api, ApiError } from '#lib/api';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let secret = $state('');
	let error = $state('');
	let pending = $state(false);

	async function login(e: Event) {
		e.preventDefault();
		error = '';
		pending = true;
		try {
			await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ secret }) });
			await goto('/admin', { invalidateAll: true });
		} catch (err) {
			error = err instanceof ApiError ? err.message : 'Đăng nhập thất bại.';
		} finally {
			pending = false;
		}
	}
</script>

<svelte:head>
	<title>Quản trị — TKT Design</title>
</svelte:head>

{#if data.authed}
	<h1>Tổng quan</h1>
	<p class="muted">Quản lý dự án đã làm và hộp thư liên hệ.</p>
	<p>
		<a class="btn" href="/admin/du-an">Dự án</a>
		<a class="btn ghost" href="/admin/lien-he">Hộp thư</a>
	</p>
{:else}
	<p class="muted">Quản trị</p>
	<h1>Đăng nhập</h1>
	<form class="stack" onsubmit={login}>
		<label>Mật khẩu quản trị<input bind:value={secret} type="password" autocomplete="current-password" required /></label>
		{#if error}<p class="error">{error}</p>{/if}
		<button class="btn" type="submit" disabled={pending}>{pending ? 'Đang kiểm tra…' : 'Vào admin'}</button>
	</form>
{/if}
