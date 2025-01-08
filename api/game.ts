import { $api } from "~/composables/use-fetch-api";

export const gameFactory = {
    createRoom() {
        return $api<{ id: string }>('/room', {method: 'POST'})
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
    created_at: Date;
    started_at: Date;
    ended_at: Date | null;
    creator: string;
    /**
     * the correct_word is not null only when the game has ended
     */
    correct_word: string | null;
    /**
     * guesses is the current user's guesses
     * [PARTIAL] - may not be displayed when list of games is fetched
     */
    guesses: WordGuess[] | null;
    /**
     * game_performance contains the best guesses of all the players
     * [PARTIAL]
     */
    game_performance: Leaderboard | null;
    id: string;
}

export type Leaderboard = PlayerSummary[];

export interface WordGuess {
    word: string | null;
    played_at: Date;
    status: number[];
}

export interface PlayerSummary {
    best: WordGuess;
    username: string;
    rank: number;
    words_played: number;
}

export interface PlayerGuessResponse {
    result: WordGuess;
    /**
     * [active] game
     * 
     * amount of players displaced in the leaderboard +2 means this user's last move displaced 2 users.
     */
    rank_offset: number | null;
    leaderboard: Leaderboard;
}