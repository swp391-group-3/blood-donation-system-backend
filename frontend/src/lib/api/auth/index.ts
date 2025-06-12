import { login } from './login';
import { me } from './me';
import { oauth2, oauth2Complete } from './oauth2';
import { register } from './register';

export const bloodGroups = [
    'o_plus',
    'o_minus',
    'a_plus',
    'a_minus',
    'b_plus',
    'b_minus',
    'a_b_plus',
    'a_b_minus',
] as const;
export const displayBloodGroup = (
    group: (typeof bloodGroups)[number],
): string => {
    switch (group) {
        case 'o_plus':
            return 'O+';
        case 'o_minus':
            return 'O-';
        case 'a_plus':
            return 'A+';
        case 'a_minus':
            return 'A-';
        case 'b_plus':
            return 'B+';
        case 'b_minus':
            return 'B-';
        case 'a_b_plus':
            return 'AB+';
        case 'a_b_minus':
            return 'AB-';
    }
};

export const genders = ['male', 'female'] as const;
export const displayGender = (gender: (typeof genders)[number]): string => {
    return gender.toUpperCase();
};

export const auth = {
    login,
    register,
    oauth2,
    oauth2Complete,
    me,
};
