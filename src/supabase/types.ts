export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Incident = Tables<'Incident'>;
type IoTCam = Tables<'IoTCam'>;
type IoTGasTemperature = Tables<'IoTGasTemperature'>;

export type Database = {
	public: {
		Tables: {
			Incident: {
				Row: {
					created_at: string;
					id: number;
					iotCamId: number | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					iotCamId?: number | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					iotCamId?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Incident_iotCamId_fkey';
						columns: ['iotCamId'];
						isOneToOne: false;
						referencedRelation: 'IoTCam';
						referencedColumns: ['id'];
					}
				];
			};
			IoTCam: {
				Row: {
					base64Encode: string | null;
					created_at: string;
					id: number;
				};
				Insert: {
					base64Encode?: string | null;
					created_at?: string;
					id?: number;
				};
				Update: {
					base64Encode?: string | null;
					created_at?: string;
					id?: number;
				};
				Relationships: [];
			};
			IoTGasTemperature: {
				Row: {
					created_at: string;
					gas: number | null;
					id: number;
					temperature: number | null;
				};
				Insert: {
					created_at?: string;
					gas?: number | null;
					id?: number;
					temperature?: number | null;
				};
				Update: {
					created_at?: string;
					gas?: number | null;
					id?: number;
					temperature?: number | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
	? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
	? PublicSchema['Enums'][PublicEnumNameOrOptions]
	: never;
