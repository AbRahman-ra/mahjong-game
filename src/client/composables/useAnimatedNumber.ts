import { ref, watch } from "vue";

export function useAnimatedNumber(source: () => number, duration = 600) {
    const displayed = ref(source());

    watch(source, (newVal, oldVal) => {
        const start = oldVal;
        const end = newVal;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            displayed.value = Math.round(start + (end - start) * eased);

            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    });

    return displayed;
}
