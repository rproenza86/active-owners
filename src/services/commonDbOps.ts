import { db } from '../firebase';

export async function getDocument<T>(docName: string): Promise<T[]> {
    return db
        .collection(docName)
        .get()
        .then(querySnapshot => {
            const data: T[] = [];

            querySnapshot.forEach(doc => {
                const entry: T = { id: doc.id, ...doc.data() } as unknown as T;
                data.push(entry);
            });

            return data;
        });
}
