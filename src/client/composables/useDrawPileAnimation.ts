import { type Ref } from "vue";
import { useGameStore } from "../store/gameStore";
import { storeToRefs } from "pinia";

const gameStore = useGameStore();
const { nextHand, honorValues } = storeToRefs(gameStore);

export const useDrawPileAnimation = (drawPileRef: Ref<HTMLElement | null>) => {
    const DURATION = 0.9;
    const dealTiles = async (tilesContainer: HTMLElement): Promise<void> => {
        const drawPile = drawPileRef.value;
        if (!drawPile) return;

        if (!nextHand.value || !honorValues.value) return;

        const tileEls = tilesContainer.querySelectorAll("[data-tile-id]");
        const sourceRect = drawPile.getBoundingClientRect();
        const sourceX = sourceRect.left + sourceRect.width / 2;
        const sourceY = sourceRect.top + sourceRect.height / 2;

        // hide real tiles until clones arrive
        tileEls.forEach((el) => {
            (el as HTMLElement).style.visibility = "hidden";
        });

        const promises = Array.from(tileEls).map((el, index) => {
            return new Promise<void>((resolve) => {
                const targetRect = el.getBoundingClientRect();
                const targetX = targetRect.left + targetRect.width / 2;
                const targetY = targetRect.top + targetRect.height / 2;

                // face-down clone at draw pile position
                const clone = el.cloneNode(true) as HTMLElement;
                clone.style.cssText = `
                    position: fixed;
                    left: ${sourceX}px;
                    top: ${sourceY}px;
                    width: ${targetRect.width}px;
                    height: ${targetRect.height}px;
                    border-radius: 1.15rem;
                    background: linear-gradient(135deg, rgba(30, 50, 70, 0.95), rgba(15, 28, 43, 0.98));
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    transform: translate(-50%, -50%) scale(0.6);
                    transition: left ${DURATION}s cubic-bezier(0.25, 1, 0.5, 1) ${index * 80}ms,
                        top ${DURATION}s cubic-bezier(0.25, 1, 0.5, 1) ${index * 80}ms,
                        transform ${DURATION}s cubic-bezier(0.25, 1, 0.5, 1) ${index * 80}ms;
                `;
                document.body.appendChild(clone);

                // force reflow
                clone.getBoundingClientRect();

                // stage 1 — fly to target + rotate to edge (halfway)
                clone.style.left = `${targetX}px`;
                clone.style.top = `${targetY}px`;
                clone.style.transform = `translate(-50%, -50%) scale(1) rotateY(90deg)`;

                const halfDuration = (DURATION * 1000) / 2 + index * 80;

                // stage 2 — swap to face-up + complete flip
                setTimeout(() => {
                    clone.style.transition = `transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)`;
                    clone.style.background = `linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,241,228,0.98))`;
                    clone.style.border = `1px solid rgba(244, 182, 107, 0.3)`;
                    clone.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.8), 0 18px 30px rgba(14,23,38,0.15)`;
                    clone.style.transform = `translate(-50%, -50%) scale(1) rotateY(0deg)`;
                }, halfDuration);

                const duration = DURATION * 1000 + index * 120;

                setTimeout(() => {
                    const realEl = el as HTMLElement;
                    realEl.style.visibility = "visible";
                    clone.remove();
                    resolve();
                }, duration);
            });
        });

        await Promise.all(promises);
    };

    return { dealTiles };
};
