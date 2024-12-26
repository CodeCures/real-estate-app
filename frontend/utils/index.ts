export function currency(amount: string) {
    return '$' + new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2
    }).format(parseFloat(amount));

}

export const getGreeting = () => {
    const hours = new Date().getHours();

    if (hours >= 5 && hours < 12) {
        return "Good Morning!";
    } else if (hours >= 12 && hours < 18) {
        return "Good Afternoon!";
    } else if (hours >= 18 && hours < 22) {
        return "Good Evening!";
    } else {
        return "Good Night!";
    }
};