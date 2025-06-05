<script lang="ts">
</script>

<div class="mt-2 flex w-full flex-col items-center gap-2 px-2 md:gap-4">
	<section class="order-1 mb-2 md:mb-4">
		<h1>
			<picture>
				<!-- Imagem para telas maiores que 1200px -->
				<source srcset="/hero-big.png" media="(min-width: 1200px)" />

				<!-- Imagem para telas entre 800px e 1199px -->
				<source srcset="/hero.png" media="(min-width: 800px)" />

				<!-- Imagem padrão para telas menores -->
				<img
					src="/hero-small.png"
					alt="Face your daily tasks like a true knight!"
					class="lg:w-[840px]"
				/>
			</picture>
		</h1>
	</section>

	<section class="order-3 mb-2 flex w-full flex-col items-center md:order-2">
		<h2 class="mb-4 text-center text-lg font-bold md:text-xl">
			Here is what <span class="text-prim">Keep It Up</span> can help you with
		</h2>
		<div class="mb-4 flex w-full flex-wrap justify-center gap-3 text-sm md:text-base">
			<div class="flex max-w-[270px] flex-col items-center">
				<h2 class="mb-2 font-semibold">🗓️ Effortless Daily Planning</h2>

				<p class="text-center">
					Quickly add and manage your daily tasks with a clean, distraction-free interface —
					designed to help you stay on track without overwhelm.
				</p>
			</div>

			<div class="flex max-w-[270px] flex-col items-center">
				<h2 class="mb-2 font-semibold">🔁 Smart Recurring Tasks</h2>

				<p class="text-center">
					Set tasks to repeat on specific weekdays. Perfect for routines, habits, and remembering
					the little things that matter most.
				</p>
			</div>

			<div class="flex max-w-[270px] flex-col items-center">
				<h2 class="mb-2 font-semibold">🧠 Built with ADHD in Mind</h2>

				<p class="text-center">
					Gentle prompts, simple flows, and zero clutter. Finally, a task manager that understands
					how your brain works.
				</p>
			</div>
		</div>
	</section>
	<a
		href="/user"
		class="order-2 rounded border border-foreground bg-transparent px-6 py-4 text-xl font-semibold text-foreground transition delay-100 duration-300 hover:border-background hover:bg-foreground hover:text-background md:order-3"
	>
		Start tackling tasks now!
	</a>
</div>
