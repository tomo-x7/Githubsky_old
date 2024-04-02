import { jsonStringToLex } from "@atproto/api";
import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { decrypt } from "./mycrypto";
const table_name = "test";
export type UserData = {
	id: number;
	created_at: string;
	bsky_password: string;
	github_name: string;
	fail_count: number;
	iv: string;
	DID: string;
};
let supabase: SupabaseClient | undefined;
export const supabasesetting = (supabase_url: string, supabase_token: string) => {
	supabase = createClient(supabase_url, supabase_token);
};

export const getUsersList = async (): Promise<Array<UserData>> => {
	if (supabase === undefined) throw new Error("Please run supabase settings before");
	const ret: Array<UserData> = [];
	const rawdata: Array<UserData> = await supabase
		.from(table_name)
		.select()
		.then((data) => {
			if (/2\d{2}/.test(data.status.toString()) && data.data && data.data.length !== 0) {
				return data.data;
			}
			throw new Error("エラー");
		});
	for (const i in rawdata) {
		try {
			rawdata[i].bsky_password = decrypt(rawdata[i].bsky_password, rawdata[i].iv);
			ret.push(rawdata[i]);
		} catch (e) {
			writelog(`${rawdata[i].DID}'s password or iv has error`);
			fail(rawdata[i].id, rawdata[i].fail_count);
		}
	}
	return ret;
};

export const deleteuser = async (id: number) => {
	if (supabase === undefined) throw new Error("Please run supabase settings before");
	const olddata:UserData|{id:null} = await supabase
		.from(table_name)
		.select()
		.eq("id", id)
		.then((data) => {
			if ((!/2\d{2}/.test(data.status.toString()))||!data.data) {
				writelog(JSON.stringify(data))
				throw new Error(`エラー:${data.status}`);
			}
			return data.data[0];
		});
	olddata.id=null
	await supabase
		.from("deleted")
		.insert(olddata)
		.then((data) => {
			if (!/2\d{2}/.test(data.status.toString())) {
				writelog(JSON.stringify(data))
				throw new Error(`エラー:${data.status}`);
			}
		});
	supabase
		.from(table_name)
		.delete()
		.eq("id", id)
		.then((data) => {
			if (!/2\d{2}/.test(data.status.toString())) {
				writelog(JSON.stringify(data))
				throw new Error(`エラー:${data.status}`);
			}
		});
};
export const success = async (id: number) => {
	if (supabase === undefined) throw new Error("Please run supabase settings before");
	supabase
		.from(table_name)
		.update({ fail_count: 0 })
		.eq("id", id)
		.then((data) => {
			console.log(id);
			if (!/2\d{2}/.test(data.status.toString())) {
				throw new Error(`エラー:${JSON.stringify(data)}`);
			}
		});
};
export const fail = async (id: number, fail_count: number) => {
	if (supabase === undefined) throw new Error("Please run supabase settings before");
	supabase
		.from(table_name)
		.update({ fail_count: fail_count + 1 })
		.eq("id", id)
		.then((data) => {
			console.log(id);
			if (!/2\d{2}/.test(data.status.toString())) {
				throw new Error(`エラー:${JSON.stringify(data)}`);
			}
		});
};

export const writelog = (log: string | number | Error | unknown) => {
	if (supabase === undefined) throw new Error("Please run supabase settings before");
	supabase
		.from("errorlog")
		.insert({ errorlog: log })
		.then((data) => {});
};
