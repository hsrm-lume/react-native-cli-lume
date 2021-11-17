import {PermissionsAndroid, Permission} from 'react-native';

class PermissonsService {
    async checkPermissions(permission: Permission) {
        return await PermissionsAndroid.check(permission);
    }

    async getPermissions(
        permission: Permission,
        title: string,
        message: string
    ): Promise<boolean> {
        if (await this.checkPermissions(permission)) {
            return true;
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: title + ' Permission',
                        message: message,
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                console.log(err);
            }
        }
        return false;
    }
}

export default PermissonsService;
