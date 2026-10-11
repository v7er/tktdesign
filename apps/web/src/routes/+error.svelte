<script lang="ts">
	import { page } from '$app/state';
</script>

<section class="section">
	<div class="wrap">
		<h1>{page.status}</h1>
		<p>{page.error?.message ?? 'Có lỗi xảy ra.'}</p>
		<a href="/">Về trang chủ</a>
	</div>
</section>
