import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Navbar
  nav_home: { en: 'Home', ar: 'الرئيسية' },
  nav_services: { en: 'Services', ar: 'الخدمات' },
  nav_admin: { en: 'Barber Access', ar: 'دخول الحلاق' },
  
  // Hero
  hero_title_1: { en: 'LOAI .', ar: 'لؤي .' },
  hero_title_2: { en: 'ALHNDI', ar: 'الهندي' },
  hero_subtitle: { en: 'Experience premium masculine grooming at LOAI . ALHNDI Barbershop.', ar: 'استمتع بحلاقة رجالية فاخرة في صالون لؤي الهندي.' },
  hero_cta: { en: 'Book Your Experience', ar: 'احجز تجربتك' },
  hero_badge: { en: 'Premium Barbershop', ar: 'صالون حلاقة فاخر' },

  // Testimonial
  testimonial_text: { en: '"Best fade I\'ve ever had. Truly professional service."', ar: '"أفضل قصة شعر حصلت عليها. خدمة احترافية حقاً."' },
  testimonial_author: { en: '— Marcus J.', ar: '— ماركوس ج.' },

  // Info Cards
  info_location_title: { en: 'Location', ar: 'الموقع' },
  info_location_desc: { en: 'Main Street, Downtown', ar: 'الشارع الرئيسي، وسط المدينة' },
  info_hours_title: { en: 'Working Hours', ar: 'ساعات العمل' },
  info_hours_line1: { en: 'Everyday: 1:00 PM - 10:00 PM', ar: 'يومياً: 1:00 م - 10:00 م' },
  info_hours_line2: { en: 'Monday: Closed (Day Off)', ar: 'الاثنين: مغلق (يوم عطلة)' },
  info_contact_title: { en: 'Contact Us', ar: 'اتصل بنا' },
  info_contact_phone: { en: '0788248382', ar: '0788248382' },
  info_contact_email: { en: 'info@loai-alhndi.com', ar: 'info@loai-alhndi.com' },

  // Services
  services_title: { en: 'Our Services', ar: 'خدماتنا' },
  services_subtitle: { en: 'Precision grooming tailored to your style. Select a service to get started.', ar: 'حلاقة دقيقة مصممة لتناسب أسلوبك. اختر خدمة للبدء.' },
  services_book_now: { en: 'Book Now', ar: 'احجز الآن' },
  services_duration_suffix: { en: 'minutes of premium grooming.', ar: 'دقيقة من الحلاقة الفاخرة.' },

  // Booking Flow
  booking_step_service: { en: 'Select Service', ar: 'اختر الخدمة' },
  booking_step_date: { en: 'Select Date', ar: 'اختر التاريخ' },
  booking_step_time: { en: 'Select Time', ar: 'اختر الوقت' },
  booking_step_details: { en: 'Your Details', ar: 'بياناتك' },
  booking_step_confirm: { en: 'Confirm', ar: 'تأكيد' },
  booking_next: { en: 'Next Step', ar: 'الخطوة التالية' },
  booking_back: { en: 'Back', ar: 'رجوع' },
  booking_confirm_btn: { en: 'Confirm Booking', ar: 'تأكيد الحجز' },
  booking_success_title: { en: 'Booking Confirmed!', ar: 'تم تأكيد الحجز!' },
  booking_success_msg: { en: 'We look forward to seeing you.', ar: 'نتطلع لرؤيتك.' },
  booking_success_btn: { en: 'Back to Home', ar: 'العودة للرئيسية' },
  booking_id_label: { en: 'Booking ID', ar: 'رقم الحجز' },
  booking_morning: { en: 'Morning', ar: 'الصباح' },
  booking_evening: { en: 'Evening', ar: 'المساء' },
  booking_name_label: { en: 'Full Name', ar: 'الاسم الكامل' },
  booking_phone_label: { en: 'Phone Number', ar: 'رقم الهاتف' },
  booking_name_placeholder: { en: 'John Doe', ar: 'أدخل اسمك الكامل' },
  booking_phone_placeholder: { en: '+1 (555) 000-0000', ar: '+966 5XX XXX XXXX' },
  booking_mins: { en: 'mins', ar: 'دقيقة' },
  booking_summary_service: { en: 'Service:', ar: 'الخدمة:' },
  booking_summary_date: { en: 'Date:', ar: 'التاريخ:' },
  booking_summary_time: { en: 'Time:', ar: 'الوقت:' },

  // Admin
  admin_title: { en: 'Barber Dashboard', ar: 'لوحة تحكم الحلاق' },
  admin_subtitle: { en: 'Manage your schedule and bookings', ar: 'إدارة جدولك وحجوزاتك' },
  admin_tab_today: { en: 'Today', ar: 'اليوم' },
  admin_tab_upcoming: { en: 'Upcoming', ar: 'القادمة' },
  admin_tab_settings: { en: 'Settings', ar: 'الإعدادات' },
  admin_search_placeholder: { en: 'Search by client name...', ar: 'البحث باسم العميل...' },
  admin_mark_completed: { en: 'Complete', ar: 'إكمال' },
  admin_status_completed: { en: 'Completed', ar: 'مكتمل' },
  admin_status_confirmed: { en: 'Confirmed', ar: 'مؤكد' },
  admin_block_title: { en: 'Block Time Slots', ar: 'حظر فترات زمنية' },
  admin_block_desc: { en: 'Prevent clients from booking specific times.', ar: 'منع العملاء من حجز أوقات محددة.' },
  admin_block_btn: { en: 'Block Slot', ar: 'حظر الفترة' },
  admin_block_success: { en: 'Slot blocked successfully', ar: 'تم حظر الفترة بنجاح' },
  admin_unknown_service: { en: 'Unknown Service', ar: 'خدمة غير معروفة' },
  admin_login_title: { en: 'Barber Access', ar: 'دخول الحلاق' },
  admin_login_desc: { en: 'Enter your password to manage bookings', ar: 'أدخل كلمة المرور لإدارة الحجوزات' },
  admin_login_btn: { en: 'Login', ar: 'تسجيل الدخول' },
  admin_password_label: { en: 'Password', ar: 'كلمة المرور' },
  admin_error_invalid: { en: 'Invalid password. Please try again.', ar: 'كلمة مرور غير صحيحة. يرجى المحاولة مرة أخرى.' },
  admin_error_generic: { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' },
  admin_cancel_confirm: { en: 'Are you sure you want to cancel this booking?', ar: 'هل أنت متأكد أنك تريد إلغاء هذا الحجز؟' },
  admin_no_today: { en: 'No bookings for today yet.', ar: 'لا توجد حجوزات لليوم بعد.' },
  admin_no_upcoming: { en: 'No upcoming bookings.', ar: 'لا توجد حجوزات قادمة.' },

  // Footer
  footer_rights: { en: '© 2026 Angle48. All rights reserved.', ar: '© 2026 Angle48. جميع الحقوق محفوظة.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
