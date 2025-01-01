import { $api, $post } from "#build/imports";

export const gameFactory = {
    createRoom() {
        return $post<{ id: string }>('/room')
    },
    joinRoom(id: string) {
        return $api<{ token: string }>(`/join/room/${id}`)
    },
    rooms() {
        return $api<Game[]>(`/room`)
    },
    room(roomid: string) {
        return $api<Game>(`/room/${roomid}`);
    },
}

export interface Game {
    created_at: any;
    started_at: any;
    ended_at: any;
    creator: string;
    /**
     * the correct_word is not null only when the game has ended
     */
    correct_word: string | null;
    /**
     * guesses is the current user's guesses
     */
    guesses: Guess[] | null;
    /**
     * game_performance contains the best guesses of all the players
     */
    game_performance: PlayerGuess[] | null;
    id: string;
}

export interface Guess {
    word: string | null;
    played_at: Date;
    status: number[];
}

export interface PlayerGuess {
    guess_response: Guess | null;
    username: string;
    /**
     * [ended] game
     * 
     * rank is null when the game has not ended
     */
    rank: number | null;
    /**
     * [active] game
     * 
     * amount of players displaced in the leaderboard +2 means this user's last move displaced 2 users.
     */
    rank_offset: number | null;
}