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
      alat: {
        Row: {
          company: string
          harga: number | null
          harga_bulanan: number
          harga_harian: number
          id: number
          initial_stok: number | null
          name: string
        }
        Insert: {
          company: string
          harga?: number | null
          harga_bulanan: number
          harga_harian: number
          id?: number
          initial_stok?: number | null
          name: string
        }
        Update: {
          company?: string
          harga?: number | null
          harga_bulanan?: number
          harga_harian?: number
          id?: number
          initial_stok?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "alat_company_fkey"
            columns: ["company"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["name"]
          },
        ]
      }
      company: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      record: {
        Row: {
          alat_name: string
          company_name: string
          id: number
          keluar: number | null
          masuk: number | null
          tanggal: string
        }
        Insert: {
          alat_name: string
          company_name: string
          id?: number
          keluar?: number | null
          masuk?: number | null
          tanggal: string
        }
        Update: {
          alat_name?: string
          company_name?: string
          id?: number
          keluar?: number | null
          masuk?: number | null
          tanggal?: string
        }
        Relationships: [
          {
            foreignKeyName: "record_company_name_fkey"
            columns: ["company_name"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["name"]
          },
        ]
      }
      stok: {
        Row: {
          alat_name: string
          amount: number
          id: number
        }
        Insert: {
          alat_name: string
          amount: number
          id?: number
        }
        Update: {
          alat_name?: string
          amount?: number
          id?: number
        }
        Relationships: []
      }
      worksheet_snapshot: {
        Row: {
          id: number
          alat_name: string
          month: string
          snapshot: Json
          label: string | null
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: number
          alat_name: string
          month: string
          snapshot: Json
          label?: string | null
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: number
          alat_name?: string
          month?: string
          snapshot?: Json
          label?: string | null
          created_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worksheet_snapshot_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_record_company_name_and_alat_table_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_unique_alat_names_between_dates: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          name: string
        }[]
      }
      random_fn: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      save_worksheet: {
        Args: {
          alat_name: string
          masuk: number[]
          keluar: number[]
          company_names: string[]
          alat_names: string[]
          tanggal: string[]
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
