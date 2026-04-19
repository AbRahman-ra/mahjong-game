import * as Settings from "@/server/core/domain/config/Settings";
import { Ref } from "vue";

export const useThrowAnimation = (
    pileAreaRef: Ref<HTMLElement | null>,
    pileRectRef: Ref<HTMLElement | null>,
    pileAreaQuerySelector: string,
) => {
    const THROWN_CARD_SCALE = 0.75;
    // HELPERS
    const throwTiles = async (tilesContainer: HTMLElement): Promise<void> => {
        const pileArea = pileAreaRef.value;
        const pileRect = pileRectRef.value?.getBoundingClientRect();
        const tileEls = tilesContainer.querySelectorAll(pileAreaQuerySelector);

        if (!pileArea || !pileRect || !tileEls.length) return;


        const handle = (el: Element, idx: number) => {
            const rect = el.getBoundingClientRect();

            // clone
            const clone = el.cloneNode(true) as HTMLElement;
            clone.style.cssText = `
                position: fixed;
                left: ${rect.left}px;
                top: ${rect.top}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                margin: 0;
                transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
            `;
            document.body.appendChild(clone);

            // force reflow
            clone.getBoundingClientRect();

            // random landing
            const x = Math.random() * (pileRect.width - rect.width);
            const y = Math.random() * (pileRect.height - rect.height);
            const angle = Math.random() * 90 - 45;

            clone.style.left = `${pileRect.left + x}px`;
            clone.style.top = `${pileRect.top + y}px`;
            clone.style.transform = `rotate(${angle}deg) scale(${THROWN_CARD_SCALE})`;

            setTimeout(() => {
                clone.style.position = "absolute";
                clone.style.left = x + "px";
                clone.style.top = y + "px";
                clone.style.transform = `rotate(${angle}deg) scale(${THROWN_CARD_SCALE})`;

                pileArea.appendChild(clone);
            }, 800);
        };

        tileEls.forEach(handle);

        // optimization: remove oldest cards if we exceed limit
        const totalDuration = 800 + tileEls.length * 80;
        const cleaner = () => {
            while (pileArea.children.length > Settings.MAX_VISIBLE_DISCARD_PILES) {
                pileArea.removeChild(pileArea.firstElementChild!);
            }
        };
        setTimeout(cleaner, totalDuration);
    };

    return { throwTiles };
};
