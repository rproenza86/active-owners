import { db } from '../firebase';
import { IDBOpsSimpleResult } from '../types';

export async function getDocument<T>(docName: string): Promise<T[]> {
    return db
        .collection(docName)
        .get()
        .then(querySnapshot => {
            const data: T[] = [];

            querySnapshot.forEach(doc => {
                const entry: T = ({ id: doc.id, ...doc.data() } as unknown) as T;
                data.push(entry);
            });

            return data;
        });
}

export async function updateDocument<T>(
    collectionName: string,
    docId: string,
    updateObj: any
): Promise<IDBOpsSimpleResult> {
    return db
        .collection(collectionName)
        .doc(docId)
        .update(updateObj)
        .then(() => {
            const msg = 'Document successfully updated!';
            console.log(msg);
            return { ok: true, msg };
        })
        .catch(function(error) {
            const errorMsg = 'Error updating document: ';
            console.error(errorMsg, error);
            return { ok: true, msg: errorMsg };
        });
}