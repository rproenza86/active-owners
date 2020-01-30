import { db } from '../firebase';
import { IDBOpsSimpleResult, IUserSubscription } from '../types';

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

export async function createDocument<T>(
    collectionName: string,
    updateObj: any
): Promise<IDBOpsSimpleResult> {
    return db
        .collection(collectionName)
        .add(updateObj)
        .then(docRef => {
            console.log('Document written with ID: ', docRef.id);
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

export async function deleteDocument<T>(
    collectionName: string,
    docId: string
): Promise<IDBOpsSimpleResult> {
    return db
        .collection(collectionName)
        .doc(docId)
        .delete()
        .then(() => {
            const msg = 'Document successfully deleted!';
            console.log(msg);
            return { ok: true, msg };
        })
        .catch(function(error) {
            const errorMsg = `Error deleting document: ${docId}`;
            console.error(errorMsg, error);
            return { ok: true, msg: errorMsg };
        });
}

export async function subscribeToAONotification<T>(
    ofTeamId: string,
    userSubscription: IUserSubscription
): Promise<IDBOpsSimpleResult> {
    return db
        .collection('teamsNotifications')
        .doc(ofTeamId)
        .collection('activeOwnerUpdates')
        .doc(userSubscription.uid)
        .set(userSubscription)
        .then(() => {
            console.log('Subscription written with ID: ', userSubscription.uid);
            const msg = 'Subscription successfully updated!';
            console.log(msg);
            return { ok: true, msg };
        })
        .catch(function(error) {
            const errorMsg = 'Error updating document: ';
            console.error(errorMsg, error);
            return { ok: true, msg: errorMsg };
        });
}

export async function updateUserAONotificationSubscription<T>(
    ofTeamId: string,
    userSubscription: IUserSubscription
): Promise<IDBOpsSimpleResult> {
    return db
        .collection('teamsNotifications')
        .doc(ofTeamId)
        .collection('activeOwnerUpdates')
        .doc(userSubscription.uid)
        .update(userSubscription)
        .then(() => {
            console.log('Subscription written with ID: ', userSubscription.uid);
            const msg = 'Subscription successfully updated!';
            console.log(msg);
            return { ok: true, msg };
        })
        .catch(function(error) {
            const errorMsg = 'Error updating document: ';
            console.error(errorMsg, error);
            return { ok: true, msg: errorMsg };
        });
}

export async function getTeamsAOSubscriptions<T>(forUserId: string): Promise<T[]> {
    try {
        const data: T[] = [];

        const querySnapshot = await db
            .collectionGroup('activeOwnerUpdates')
            .where('uid', '==', forUserId)
            .orderBy('email')
            .get();

        for (const doc of querySnapshot.docs) {
            const entry: T = ({
                id: doc.id,
                ...doc.data()
            } as unknown) as T;
            data.push(entry);
        }

        return data;
    } catch (error) {
        const errorMsg = `Error getting Subscriptions documents.`;
        console.error(errorMsg, error);
        return [];
    }
}

export async function unsubscribeToAONotification<T>(
    uid: string,
    teamId: string
): Promise<IDBOpsSimpleResult> {
    return db
        .collection('teamsNotifications')
        .doc(teamId)
        .collection('activeOwnerUpdates')
        .doc(uid)
        .delete()
        .then(() => {
            const msg = 'Subscription successfully deleted!';
            console.log(msg);
            return { ok: true, msg };
        })
        .catch(function(error: any) {
            const errorMsg = `Error deleting Subscription document: teamId ${teamId} / uid ${uid}`;
            console.error(errorMsg, error);
            return { ok: true, msg: errorMsg };
        });
}
