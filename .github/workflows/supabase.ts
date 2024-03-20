import { type SupabaseClient, createClient } from "@supabase/supabase-js";

export type UserData = {
	id: number;
	created_at: string;
	bsky_handle: string;
	bsky_password: string;
	github_name: string;
	fail_count: number;
};
let supabase: SupabaseClient | undefined;
export const supabasesetting = (
	supabase_url: string,
	supabase_token: string,
) => {
	supabase = createClient(supabase_url, supabase_token);
};
export const getUsersList = async (): Promise<Array<UserData>> => {
	if (supabase === undefined)
		throw new Error("Please run supabase settings before");
	const ret: Array<UserData> = [];
	const data: Array<UserData> = await supabase
		.from("userdata")
		.select()
		.then((data) => {
			if (
				/2\d{2}/.test(data.status.toString()) &&
				data.data &&
				data.data.length !== 0
			) {
				return data.data;
			}
			throw new Error("エラー");
		});
	for (const i in data) {
		ret.push(data[i]);
	}
	return ret;
};

export const deleteuser = async (id: number) => {
	if (supabase === undefined)
		throw new Error("Please run supabase settings before");
	supabase
		.from("userdata")
		.delete()
		.eq("id", id)
		.then((data) => {
			if (!/2\d{2}/.test(data.status.toString())) {
				throw new Error("エラー");
			}
		});
};
export const fail = async (id: number, fail_count: number) => {
	if (supabase === undefined)
		throw new Error("Please run supabase settings before");
	supabase
		.from("userdata")
		.upsert({ fail_count: fail_count + 1 })
		.eq("id", id)
		.then((data) => {
			if (!/2\d{2}/.test(data.status.toString())) {
				throw new Error("エラー");
			}
		});
};

export const writelog = (log: string|number|Error|unknown) => {
	if (supabase === undefined)
		throw new Error("Please run supabase settings before");
	supabase.from("errorlog").insert({ errorlog: log });
};
