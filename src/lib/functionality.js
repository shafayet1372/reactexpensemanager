let getGroupedDataByDate = (data) => {
    let result = data.reduce((acc, val) => {
        let date = val.date;
        if (acc[date]) {
            acc[date].push(val);
        } else {
            acc[date] = [];
            acc[date].push(val);
        }
        return acc;
    }, {});
    return Object.entries(result);
};

let getAmountData = (data) => {
    return data.map((x) => x[1]).flat(Infinity);
};

let getTotalIncome = (data) => {
    let b = getAmountData(data);
    return b.reduce(
        (acc, val) => (val.type == "income" ? acc + val.amount : acc),
        0
    );
};

let getTotalExpense = (data) => {
    let b = getAmountData(data);
    return b.reduce(
        (acc, val) => (val.type == "expense" ? acc + val.amount : acc),
        0
    );
};
let getSortedDataByDate = (data, date) => {
    if (!date) {
        return data;
    }
    return data.filter((x) => x[0] == new Date(date).toLocaleDateString());
};


export { getGroupedDataByDate, getAmountData, getTotalIncome, getTotalExpense, getSortedDataByDate }