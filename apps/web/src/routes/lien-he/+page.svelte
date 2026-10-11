<script lang="ts">
	import IconClock from '@tabler/icons-svelte-runes/icons/clock';
	import IconMail from '@tabler/icons-svelte-runes/icons/mail';
	import IconMapPin from '@tabler/icons-svelte-runes/icons/map-pin';
	import IconPhone from '@tabler/icons-svelte-runes/icons/phone';
	import { api, ApiError } from '#lib/api';
	import { site } from '#lib/site';

	const stroke = 1.3;

	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let district = $state('');
	let land_area_m2 = $state('');
	let message = $state('');
	let error = $state('');
	let done = $state(false);
	let pending = $state(false);

	async function submit(e: Event) {
		e.preventDefault();
		error = '';
		pending = true;
		try {
			await api('/api/inquiries', {
				method: 'POST',
				body: JSON.stringify({
					name,
					phone,
					email,
					district,
					land_area_m2: land_area_m2 ? Number(land_area_m2) : null,
					message
				})
			});
			done = true;
		} catch (err) {
			error = err instanceof ApiError ? err.message : 'Gửi không thành công.';
		} finally {
			pending = false;
		}
	}
</script>

<svelte:head>
	<title>Liên hệ — {site.name}</title>
</svelte:head>

<section class="section">
	<div class="wrap detail-grid">
		<div>
			<p class="muted">Liên hệ</p>
			<h1>Gửi lô đất, chúng tôi trả lời công năng</h1>
			<p class="muted">
				Nói rõ người ở, số xe, có ông bà hay không. Ảnh lô đất (nếu có) gửi thêm qua Zalo {site.phone}.
			</p>
			{#if done}
				<p class="ok">Đã nhận. TKT sẽ gọi lại trong giờ làm việc.</p>
			{:else}
				<form class="stack" onsubmit={submit}>
					<label>Họ tên<input bind:value={name} required autocomplete="name" /></label>
					<label>Số điện thoại<input bind:value={phone} required inputmode="tel" autocomplete="tel" /></label>
					<label>Email (không bắt buộc)<input bind:value={email} type="email" autocomplete="email" /></label>
					<label>Quận / huyện<input bind:value={district} /></label>
					<label>Diện tích đất (m²)<input bind:value={land_area_m2} inputmode="numeric" /></label>
					<label>
						Nhu cầu
						<textarea
							bind:value={message}
							required
							placeholder="Ví dụ: đất 5x16, ở 5 người gồm ông bà, 3 xe máy, muốn bếp sau nhà."
						></textarea>
					</label>
					{#if error}<p class="error">{error}</p>{/if}
					<button class="btn" type="submit" disabled={pending}>
						{pending ? 'Đang gửi…' : 'Gửi yêu cầu'}
					</button>
				</form>
			{/if}
		</div>
		<aside>
			<ul class="facts">
				<li>
					<span class="fact-label"><IconPhone size={16} {stroke} /> Điện thoại</span><b>{site.phone}</b>
				</li>
				<li>
					<span class="fact-label"><IconMail size={16} {stroke} /> Email</span><b>{site.email}</b>
				</li>
				<li>
					<span class="fact-label"><IconMapPin size={16} {stroke} /> Địa chỉ</span><b>{site.address}</b>
				</li>
				<li>
					<span class="fact-label"><IconClock size={16} {stroke} /> Giờ</span><b>{site.hours}</b>
				</li>
			</ul>
		</aside>
	</div>
</section>
