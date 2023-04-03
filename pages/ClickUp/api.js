export const getAllListTask = async (data) => {
    let listId = data.list_id;
    let teamId = 3357294;
    let myAssigneId = 3445611;
    let query = new URLSearchParams({
        // page: '0',
        subtasks: true,
        date_created_gt: data.date_created,
        include_closed: true
        //date_created_lt :11
    }).toString()
    query = query + `&space_ids[]=${'3454979'}&space_ids[]=${'61347289'}&assignees[]=${myAssigneId}`;

    console.log('strat');
    let url = `https://api.clickup.com/api/v2/team/${teamId}/task?${query}`;
    // let url = `https://api.clickup.com/api/v2/task/${'2qupzc2'}`;

    console.log(url, 'url');
    const response = await fetch(url, {
        method: "GET",
        headers: {
            // "Content-Type": "application/json",
            "Authorization": process.env.CLICK_UP_KEY
        },
    });
    const data1 = await response.json();
    return data1;

}