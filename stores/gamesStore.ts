import { defineStore } from 'pinia'
import { gameFactory, type Game } from '~/api/game';

export const useGamesStore = defineStore('useGamesStore', {
  state: () => ({
    loading: false,
    games: [] as Game[],
    last_fetched: Date,
    error: null as string | null,
  }),
  actions: {
    async refresh() {
      try {
        this.loading = true;
        this.error = '';

        const result = await gameFactory.rooms();
        if (!!result) {
          this.games = result
          this.error = ''
          this.last_fetched = new Date();
        }
      } catch (e) {
        console.error(e);
        this.error = "failed to get user's rooms";
      } finally {
        this.loading = false;
      }
    }
  },
})