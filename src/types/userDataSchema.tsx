const userDataSchema: Realm.ObjectSchema = {
    name: 'userData',
    properties: {
        uid: 'string',
        fireStatus: 'bool',
    },
    primaryKey: 'uid',
};

export {userDataSchema};
