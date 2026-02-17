// Manually maintained — regenerate with `npm run gen:types` after each migration.
// Last updated: 2026-02-17 (migration 20260217000002_foundation_enhancements)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id:                  string
          name:                string
          category:            string
          address:             string
          region:              string
          rating:              number
          review_count:        number
          image_url:           string
          description:         string | null
          opening_hours:       string | null
          phone:               string | null
          website:             string | null
          email:               string | null
          is_verified:         boolean
          is_featured:         boolean
          status:              string
          owner_id:            string | null
          lat:                 number | null
          lng:                 number | null
          tags:                string[]
          price_range:         string | null
          created_at:          string
          // Added by migration 20260217000002
          slug:                string
          short_description:   string | null
          whatsapp:            string | null
          halal_certification: string
          muis_cert_number:    string | null
          muis_cert_expiry:    string | null
          view_count:          number
          listing_tier:        string
          tier_expires_at:     string | null
          is_claimed:          boolean
          search_vector:       string | null
        }
        Insert: {
          id?:                 string
          name:                string
          category:            string
          address:             string
          region:              string
          rating?:             number
          review_count?:       number
          image_url:           string
          description?:        string | null
          opening_hours?:      string | null
          phone?:              string | null
          website?:            string | null
          email?:              string | null
          is_verified?:        boolean
          is_featured?:        boolean
          status?:             string
          owner_id?:           string | null
          lat?:                number | null
          lng?:                number | null
          tags?:               string[]
          price_range?:        string | null
          created_at?:         string
          slug?:               string
          short_description?:  string | null
          whatsapp?:           string | null
          halal_certification?: string
          muis_cert_number?:   string | null
          muis_cert_expiry?:   string | null
          view_count?:         number
          listing_tier?:       string
          tier_expires_at?:    string | null
          is_claimed?:         boolean
        }
        Update: {
          name?:               string
          category?:           string
          address?:            string
          region?:             string
          rating?:             number
          review_count?:       number
          image_url?:          string
          description?:        string | null
          opening_hours?:      string | null
          phone?:              string | null
          website?:            string | null
          email?:              string | null
          is_verified?:        boolean
          is_featured?:        boolean
          status?:             string
          owner_id?:           string | null
          lat?:                number | null
          lng?:                number | null
          tags?:               string[]
          price_range?:        string | null
          slug?:               string
          short_description?:  string | null
          whatsapp?:           string | null
          halal_certification?: string
          muis_cert_number?:   string | null
          muis_cert_expiry?:   string | null
          view_count?:         number
          listing_tier?:       string
          tier_expires_at?:    string | null
          is_claimed?:         boolean
        }
        Relationships: []
      }
      events: {
        Row: {
          id:          string
          title:       string
          type:        string
          date:        string
          time:        string
          location:    string
          image_url:   string
          description: string
          is_free:     boolean
          price:       number | null
          organizer:   string | null
          owner_id:    string | null
          status:      string
          lat:         number | null
          lng:         number | null
          created_at:  string
        }
        Insert: {
          id?:         string
          title:       string
          type:        string
          date:        string
          time:        string
          location:    string
          image_url:   string
          description: string
          is_free?:    boolean
          price?:      number | null
          organizer?:  string | null
          owner_id?:   string | null
          status?:     string
          lat?:        number | null
          lng?:        number | null
          created_at?: string
        }
        Update: {
          title?:       string
          type?:        string
          date?:        string
          time?:        string
          location?:    string
          image_url?:   string
          description?: string
          is_free?:     boolean
          price?:       number | null
          organizer?:   string | null
          status?:      string
          lat?:         number | null
          lng?:         number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id:                  string
          business_id:         string
          user_id:             string | null
          user_name:           string
          user_avatar:         string | null
          rating:              number
          comment:             string
          title:               string | null
          vibe_tags:           string[]
          helpful:             number
          created_at:          string
          // Added by migration 20260217000002
          food_rating:         number | null
          service_rating:      number | null
          halal_confidence:    number | null
          value_rating:        number | null
          owner_response:      string | null
          owner_responded_at:  string | null
          review_status:       string
        }
        Insert: {
          id?:                 string
          business_id:         string
          user_id?:            string | null
          user_name:           string
          user_avatar?:        string | null
          rating:              number
          comment:             string
          title?:              string | null
          vibe_tags?:          string[]
          helpful?:            number
          created_at?:         string
          food_rating?:        number | null
          service_rating?:     number | null
          halal_confidence?:   number | null
          value_rating?:       number | null
          owner_response?:     string | null
          review_status?:      string
        }
        Update: {
          user_name?:          string
          user_avatar?:        string | null
          rating?:             number
          comment?:            string
          title?:              string | null
          vibe_tags?:          string[]
          helpful?:            number
          food_rating?:        number | null
          service_rating?:     number | null
          halal_confidence?:   number | null
          value_rating?:       number | null
          owner_response?:     string | null
          owner_responded_at?: string | null
          review_status?:      string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id:                  string
          email:               string
          name:                string
          avatar:              string | null
          role:                string
          phone:               string | null
          created_at:          string
          subscription:        string
          subscription_status: string | null
          subscription_expiry: string | null
        }
        Insert: {
          id:                   string
          email:                string
          name:                 string
          avatar?:              string | null
          role?:                string
          phone?:               string | null
          created_at?:          string
          subscription?:        string
          subscription_status?: string | null
          subscription_expiry?: string | null
        }
        Update: {
          email?:               string
          name?:                string
          avatar?:              string | null
          role?:                string
          phone?:               string | null
          subscription?:        string
          subscription_status?: string | null
          subscription_expiry?: string | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          user_id:     string
          business_id: string
          created_at:  string
        }
        Insert: {
          user_id:     string
          business_id: string
          created_at?: string
        }
        Update: {
          user_id?:     string
          business_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id:           string
          title:        string
          category:     string
          published_at: string
          author:       string
          image:        string
          excerpt:      string
          content:      string | null
          tags:         string[]
          created_at:   string
        }
        Insert: {
          id?:          string
          title:        string
          category:     string
          published_at?: string
          author:       string
          image:        string
          excerpt:      string
          content?:     string | null
          tags?:        string[]
          created_at?:  string
        }
        Update: {
          title?:        string
          category?:     string
          published_at?: string
          author?:       string
          image?:        string
          excerpt?:      string
          content?:      string | null
          tags?:         string[]
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id:         string
          user_id:    string
          title:      string
          message:    string
          type:       string
          read:       boolean
          created_at: string
          link:       string | null
        }
        Insert: {
          id?:        string
          user_id:    string
          title:      string
          message:    string
          type:       string
          read?:      boolean
          created_at?: string
          link?:      string | null
        }
        Update: {
          title?:   string
          message?: string
          type?:    string
          read?:    boolean
          link?:    string | null
        }
        Relationships: []
      }
      // New tables from migration 20260217000002
      categories: {
        Row: {
          id:            string
          name:          string
          slug:          string
          icon:          string | null
          parent_id:     string | null
          display_order: number
          is_active:     boolean
          created_at:    string
        }
        Insert: {
          id?:            string
          name:           string
          slug:           string
          icon?:          string | null
          parent_id?:     string | null
          display_order?: number
          is_active?:     boolean
          created_at?:    string
        }
        Update: {
          name?:          string
          slug?:          string
          icon?:          string | null
          parent_id?:     string | null
          display_order?: number
          is_active?:     boolean
        }
        Relationships: []
      }
      locations: {
        Row: {
          id:         string
          name:       string
          slug:       string
          type:       string
          region:     string | null
          lat:        number | null
          lng:        number | null
          created_at: string
        }
        Insert: {
          id?:         string
          name:        string
          slug:        string
          type:        string
          region?:     string | null
          lat?:        number | null
          lng?:        number | null
          created_at?: string
        }
        Update: {
          name?:   string
          slug?:   string
          type?:   string
          region?: string | null
          lat?:    number | null
          lng?:    number | null
        }
        Relationships: []
      }
      business_categories: {
        Row: {
          business_id: string
          category_id: string
          is_primary:  boolean
        }
        Insert: {
          business_id: string
          category_id: string
          is_primary?:  boolean
        }
        Update: {
          is_primary?: boolean
        }
        Relationships: []
      }
      leads: {
        Row: {
          id:          string
          business_id: string
          name:        string
          email:       string
          phone:       string | null
          type:        string
          message:     string
          status:      string
          created_at:  string
        }
        Insert: {
          id?:         string
          business_id: string
          name:        string
          email:       string
          phone?:      string | null
          type?:       string
          message:     string
          status?:     string
          created_at?: string
        }
        Update: {
          name?:    string
          email?:   string
          phone?:   string | null
          type?:    string
          message?: string
          status?:  string
        }
        Relationships: []
      }
      business_claims: {
        Row: {
          id:          string
          business_id: string
          user_id:     string
          proof_url:   string | null
          message:     string
          status:      string
          reviewed_at: string | null
          reviewed_by: string | null
          created_at:  string
        }
        Insert: {
          id?:          string
          business_id:  string
          user_id:      string
          proof_url?:   string | null
          message:      string
          status?:      string
          reviewed_at?: string | null
          reviewed_by?: string | null
          created_at?:  string
        }
        Update: {
          proof_url?:   string | null
          message?:     string
          status?:      string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          id:          string
          event_id:    string
          user_id:     string | null
          name:        string
          email:       string
          phone:       string | null
          ticket_code: string
          checked_in:  boolean
          created_at:  string
        }
        Insert: {
          id?:          string
          event_id:     string
          user_id?:     string | null
          name:         string
          email:        string
          phone?:       string | null
          ticket_code?: string
          checked_in?:  boolean
          created_at?:  string
        }
        Update: {
          name?:       string
          phone?:      string | null
          checked_in?: boolean
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never
