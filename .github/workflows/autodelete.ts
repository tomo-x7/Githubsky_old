import {
	getUsersList,
	supabasesetting,
	writelog,
} from "./supabase";
const main = async () => {
	supabasesetting(process.argv[2], process.argv[3]);
	const userslist = await getUsersList();

	for (const i in userslist) {
		try {
			if(userslist[i].fail_count>3){
                console.log(`id=${userslist[i].id},DID=${userslist[i].DID}を削除:fail_count=${userslist[i].fail_count}`)
            }
		} catch (e) {
			writelog(e);
		}
	}

	//
};

main();
