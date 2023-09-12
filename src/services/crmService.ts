import apiClient from '@services/apiClient';
import { updateTokens } from '@services/tokenService';

type ContactArgs = {
  email?: string;
  name?: string;
  phone?: string;
};

type Contact = {
  account_id?: number;
  closest_task_at?: number;
  created_at?: number;
  created_by?: number;
  custom_fields_values?: { field_code: string; field_id: number }[];
  first_name?: string;
  group_id?: number;
  id: number;
  is_deleted?: boolean;
  last_name?: string;
  name?: string;
  responsible_user_id?: number;
  updated_at?: number;
  updated_by?: number;
};

type ApiResponse<K extends string, T> = {
  _embedded: {
    [Key in K]: T;
  };
};

type CustomFields = { code: string; enums: string[]; id: number }[];
export async function getContact({ email, name, phone }: ContactArgs) {
  const tokens = await updateTokens();

  try {
    const { data } = await apiClient.get<ApiResponse<'contacts', Contact[]>>(
      '/api/v4/contacts',
      {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
        params: {
          query: name || phone || email,
        },
      },
    );

    return data._embedded.contacts[0];
  } catch (_) {
    return null;
  }
  // console.log(data._embedded.contacts[0]);
}

export async function updateContact({
  email,
  id,
  name,
  phone,
}: ContactArgs & Contact) {
  const tokens = await updateTokens();

  try {
    const updatedData: {
      custom_fields_values?: {
        field_id: number;
        field_name: 'Email' | 'Телефон';
        values: [{ enum_code: 'WORK'; value: string }];
      }[];
      name?: string;
    } = { custom_fields_values: [] };

    const ids = await getFieldIds();
    if (!ids) return;

    if (name) updatedData.name = name;
    if (email)
      updatedData.custom_fields_values?.push({
        field_id: ids[1] ?? -1,
        field_name: 'Email',
        values: [{ enum_code: 'WORK', value: email }],
      });

    if (phone)
      updatedData.custom_fields_values?.push({
        field_id: ids[0] ?? -1,
        field_name: 'Телефон',
        values: [{ enum_code: 'WORK', value: phone }],
      });

    const { data } = await apiClient.patch<Pick<Contact, 'id' | 'updated_at'>>(
      `/api/v4/contacts/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      },
    );
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function createContact({ email, name, phone }: ContactArgs) {
  const tokens = await updateTokens();
  try {
    const { data: contact } = await apiClient.post<
      ApiResponse<'contacts', Contact[]>
    >('/api/v4/contacts', [{ name }], {
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    });

    await updateContact({ email, id: contact._embedded.contacts[0].id, phone });

    return contact._embedded.contacts[0];
  } catch (e) {
    console.log(e);
  }
}

export async function createLead(createdBy: Contact) {
  const tokens = await updateTokens();
  try {
    const { data: lead } = await apiClient.post(
      '/api/v4/leads/complex',
      [{ _embedded: { contacts: [createdBy] }, created_by: 0 }],
      {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      },
    );
  } catch (e) {
    console.log(e);
  }
}

async function getFieldIds() {
  const tokens = await updateTokens();
  const { data: fields } = await apiClient.get<
    ApiResponse<'custom_fields', CustomFields>
  >('/api/v4/contacts/custom_fields', {
    headers: {
      Authorization: `Bearer ${tokens.access}`,
    },
  });

  if (!fields._embedded.custom_fields) return null;
  const phoneField = fields._embedded.custom_fields.find(
    (item) => item.code === 'PHONE',
  );
  const phoneId = phoneField?.id;

  const emailField = fields._embedded.custom_fields.find(
    (item) => item.code === 'EMAIL',
  );
  const emailId = emailField?.id;

  return [phoneId, emailId] as const;
}
