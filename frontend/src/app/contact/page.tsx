'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/stores/useStore';
import { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const { locale } = useStore();
  const isRTL = locale === 'he';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      titleEn: 'Address',
      titleHe: 'כתובת',
      valueEn: 'Tel Aviv, Israel',
      valueHe: 'תל אביב, ישראל',
    },
    {
      icon: Phone,
      titleEn: 'Phone',
      titleHe: 'טלפון',
      valueEn: '+972-3-123-4567',
      valueHe: '03-123-4567',
    },
    {
      icon: Mail,
      titleEn: 'Email',
      titleHe: 'אימייל',
      valueEn: 'info@zeketa.com',
      valueHe: 'info@zeketa.com',
    },
    {
      icon: Clock,
      titleEn: 'Hours',
      titleHe: 'שעות פעילות',
      valueEn: 'Sun-Thu: 9:00-18:00',
      valueHe: 'א-ה: 09:00-18:00',
    },
  ];

  const subjects = [
    { value: 'general', labelEn: 'General Inquiry', labelHe: 'פנייה כללית' },
    { value: 'order', labelEn: 'Order Status', labelHe: 'סטטוס הזמנה' },
    { value: 'return', labelEn: 'Returns & Exchanges', labelHe: 'החזרות והחלפות' },
    { value: 'product', labelEn: 'Product Question', labelHe: 'שאלה על מוצר' },
    { value: 'other', labelEn: 'Other', labelHe: 'אחר' },
  ];

  return (
    <main className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-4"
          >
            {isRTL ? 'צור קשר' : 'CONTACT US'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            {isRTL ? 'נשמח לשמוע ממך!' : "We'd love to hear from you!"}
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">
                {isRTL ? 'שלחו לנו הודעה' : 'Send us a message'}
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    {isRTL ? 'ההודעה נשלחה!' : 'Message Sent!'}
                  </h3>
                  <p className="text-green-600">
                    {isRTL ? 'נחזור אליך בהקדם' : "We'll get back to you soon"}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-green-700 underline hover:no-underline"
                  >
                    {isRTL ? 'שלח הודעה נוספת' : 'Send another message'}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'שם מלא' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                        placeholder={isRTL ? 'הכנס את שמך' : 'Enter your name'}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'אימייל' : 'Email'} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                        placeholder={isRTL ? 'example@email.com' : 'example@email.com'}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'טלפון' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                        placeholder={isRTL ? '050-000-0000' : '050-000-0000'}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        {isRTL ? 'נושא' : 'Subject'} *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">{isRTL ? 'בחר נושא' : 'Select a subject'}</option>
                        {subjects.map(subject => (
                          <option key={subject.value} value={subject.value}>
                            {isRTL ? subject.labelHe : subject.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'הודעה' : 'Message'} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none"
                      placeholder={isRTL ? 'כתוב את הודעתך כאן...' : 'Write your message here...'}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Send size={20} />
                        {isRTL ? 'שלח הודעה' : 'Send Message'}
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">
                {isRTL ? 'פרטי התקשרות' : 'Contact Information'}
              </h2>

              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {isRTL ? info.titleHe : info.titleEn}
                      </h3>
                      <p className="text-gray-600">
                        {isRTL ? info.valueHe : info.valueEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                  <p>{isRTL ? 'מפה תתווסף בקרוב' : 'Map coming soon'}</p>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isRTL ? 'עקבו אחרינו' : 'Follow Us'}
                </h3>
                <div className="flex gap-3">
                  {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                    <a
                      key={social}
                      href={`https://${social.toLowerCase()}.com/zeketa`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isRTL ? 'שאלות נפוצות' : 'Frequently Asked Questions'}
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                qEn: 'What are your shipping times?',
                qHe: 'מה זמני המשלוח?',
                aEn: 'Standard shipping takes 3-5 business days within Israel. Express shipping available.',
                aHe: 'משלוח רגיל לוקח 3-5 ימי עסקים בישראל. משלוח אקספרס זמין.',
              },
              {
                qEn: 'What is your return policy?',
                qHe: 'מהי מדיניות ההחזרות?',
                aEn: 'We offer 30-day returns for unused items in original packaging.',
                aHe: 'אנו מציעים החזרות עד 30 יום למוצרים שלא נעשה בהם שימוש באריזה המקורית.',
              },
              {
                qEn: 'How can I track my order?',
                qHe: 'איך אוכל לעקוב אחרי ההזמנה?',
                aEn: 'You will receive a tracking number via email once your order ships.',
                aHe: 'תקבלו מספר מעקב במייל ברגע שההזמנה תישלח.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {isRTL ? faq.qHe : faq.qEn}
                </h3>
                <p className="text-gray-600">
                  {isRTL ? faq.aHe : faq.aEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
