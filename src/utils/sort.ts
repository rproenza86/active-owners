export const sortList = (items: any[], key: string) =>
    items.sort(function(a: any, b: any) {
        const nameA = a[key].toUpperCase(); // ignore upper and lowercase
        const nameB = b[key].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });
