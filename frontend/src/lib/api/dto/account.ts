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

export type BloodGroup = (typeof bloodGroups)[number];

export const displayBloodGroup = (bloodGroup: BloodGroup): string => {
    switch (bloodGroup) {
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

export type Gender = (typeof genders)[number];

export const displayGender = (gender: Gender): string => {
    return gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();
};

export type Role = 'member' | 'staff' | 'admin';

export interface Account {
    role: Role;
    email: string;
    name: string;
    phone: string;
    address: string;
    birthday: string;
    blood_group: BloodGroup;
    gender: Gender;
    created_at: Date;
}
