import * as nsfwjs from 'nsfwjs';

export class NSFWChecker {
  private model: nsfwjs.NSFWJS | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  async loadModel() {
    if (!this.model) {
      this.model = await nsfwjs.load();
    }
  }

  async checkFrame(videoEl: HTMLVideoElement): Promise<{ isSafe: boolean; category: string; confidence: number }> {
    if (!this.model) await this.loadModel();
    if (!videoEl || videoEl.readyState < 2) {
      return { isSafe: true, category: 'Neutral', confidence: 1 };
    }

    const predictions = await this.model!.classify(videoEl);
    const topPrediction = predictions[0];
    const { className, probability } = topPrediction;

    const isUnsafe = (className === 'Porn' || className === 'Hentai' || className === 'Sexy') && probability > 0.75;

    return {
      isSafe: !isUnsafe,
      category: className,
      confidence: probability
    };
  }

  startMonitoring(videoEl: HTMLVideoElement, onUnsafe: (category: string) => void, intervalMs = 3000) {
    this.stopMonitoring();
    this.intervalId = setInterval(async () => {
      const { isSafe, category } = await this.checkFrame(videoEl);
      if (!isSafe) {
        onUnsafe(category);
      }
    }, intervalMs);

    return () => this.stopMonitoring();
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
