import { supabase } from '@/lib/supabase/client';
import { CustomerAddress, AddressFormData } from '@/types/address';

export const AddressService = {
  // Validate Indian PIN code (exactly 6 digits, first digit 1-9)
  validatePinCode(pin: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pin.trim());
  },

  // Validate phone number (10 to 15 digits, optional + prefix)
  validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/[\s-]/g, '');
    return /^\+?[0-9]{10,15}$/.test(cleaned);
  },

  // Format phone number to clean representation
  normalizePhone(phone: string): string {
    return phone.trim().replace(/[^\d+]/g, '');
  },

  // Fetch all addresses for authenticated user
  async fetchAddresses(userId: string): Promise<{ data: CustomerAddress[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      const addresses: CustomerAddress[] = (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        recipientName: row.recipient_name,
        phone: row.phone,
        streetLine1: row.street_line1,
        streetLine2: row.street_line2,
        landmark: row.landmark,
        city: row.city,
        stateProvince: row.state_province,
        postalCode: row.postal_code,
        country: row.country || 'India',
        addressType: row.address_type || 'Home',
        isDefault: Boolean(row.is_default),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return { data: addresses };
    } catch (err) {
      return { data: [], error: 'Failed to load saved addresses.' };
    }
  },

  // Add new address
  async addAddress(userId: string, form: AddressFormData): Promise<{ data?: CustomerAddress; error?: string }> {
    if (!form.recipientName.trim()) {
      return { error: 'Full recipient name is required.' };
    }

    if (!this.validatePhone(form.phone)) {
      return { error: 'A valid Indian mobile or contact number (10 digits) is required.' };
    }

    if (!form.streetLine1.trim()) {
      return { error: 'Address line 1 (House/Apartment & Street) is required.' };
    }

    if (!form.city.trim()) {
      return { error: 'City is required.' };
    }

    if (!form.stateProvince.trim()) {
      return { error: 'State / Province is required.' };
    }

    if (!this.validatePinCode(form.postalCode)) {
      return { error: 'A valid 6-digit Indian PIN code is required (e.g. 400001).' };
    }

    try {
      const payload = {
        user_id: userId,
        recipient_name: form.recipientName.trim(),
        phone: this.normalizePhone(form.phone),
        street_line1: form.streetLine1.trim(),
        street_line2: form.streetLine2?.trim() || null,
        landmark: form.landmark?.trim() || null,
        city: form.city.trim(),
        state_province: form.stateProvince.trim(),
        postal_code: form.postalCode.trim(),
        country: 'India',
        address_type: form.addressType,
        is_default: form.isDefault,
      };

      const { data, error } = await supabase
        .from('addresses')
        .insert(payload)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return {
        data: {
          id: data.id,
          userId: data.user_id,
          recipientName: data.recipient_name,
          phone: data.phone,
          streetLine1: data.street_line1,
          streetLine2: data.street_line2,
          landmark: data.landmark,
          city: data.city,
          stateProvince: data.state_province,
          postalCode: data.postal_code,
          country: data.country,
          addressType: data.address_type,
          isDefault: Boolean(data.is_default),
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      };
    } catch {
      return { error: 'Failed to save address.' };
    }
  },

  // Update existing address
  async updateAddress(
    userId: string,
    addressId: string,
    form: AddressFormData
  ): Promise<{ data?: CustomerAddress; error?: string }> {
    if (!form.recipientName.trim()) {
      return { error: 'Full recipient name is required.' };
    }

    if (!this.validatePhone(form.phone)) {
      return { error: 'A valid contact number (10 digits) is required.' };
    }

    if (!form.streetLine1.trim()) {
      return { error: 'Address line 1 is required.' };
    }

    if (!form.city.trim()) {
      return { error: 'City is required.' };
    }

    if (!form.stateProvince.trim()) {
      return { error: 'State is required.' };
    }

    if (!this.validatePinCode(form.postalCode)) {
      return { error: 'A valid 6-digit Indian PIN code is required.' };
    }

    try {
      const payload = {
        recipient_name: form.recipientName.trim(),
        phone: this.normalizePhone(form.phone),
        street_line1: form.streetLine1.trim(),
        street_line2: form.streetLine2?.trim() || null,
        landmark: form.landmark?.trim() || null,
        city: form.city.trim(),
        state_province: form.stateProvince.trim(),
        postal_code: form.postalCode.trim(),
        address_type: form.addressType,
        is_default: form.isDefault,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('addresses')
        .update(payload)
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return {
        data: {
          id: data.id,
          userId: data.user_id,
          recipientName: data.recipient_name,
          phone: data.phone,
          streetLine1: data.street_line1,
          streetLine2: data.street_line2,
          landmark: data.landmark,
          city: data.city,
          stateProvince: data.state_province,
          postalCode: data.postal_code,
          country: data.country,
          addressType: data.address_type,
          isDefault: Boolean(data.is_default),
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      };
    } catch {
      return { error: 'Failed to update address.' };
    }
  },

  // Set address as primary default
  async setDefault(userId: string, addressId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('id', addressId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Failed to set default address.' };
    }
  },

  // Delete address
  async deleteAddress(userId: string, addressId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Failed to delete address.' };
    }
  },
};
