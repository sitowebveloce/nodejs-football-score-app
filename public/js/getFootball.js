
export async function getFootball (){
	try {
		let headerObj = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			// body: JSON.stringify(position)
		};
		// POST
		const res = await fetch('/api/get', headerObj);
		const data = await res.json();
		// console.log(data);
		return data;

	} catch(e) {
		// statements
		console.log(e);
		return e.message;
	}
};