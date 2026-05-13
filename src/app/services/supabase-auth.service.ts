import { Injectable } from "@angular/core";
import { createClient, SupabaseClient, AuthResponse } from "@supabase/supabase-js";
import { environment } from "@neatnest/environments";

@Injectable({
    providedIn: "root"
})
export class SupabaseAuthService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    }

    async signup(email: string, password: string): Promise<AuthResponse> {
        return this.supabase.auth.signUp({
            email,
            password,
        });
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        return this.supabase.auth.signInWithPassword({
            email,
            password,
        });
    }

    async logout(): Promise<void> {
        await this.supabase.auth.signOut();
    }
}
