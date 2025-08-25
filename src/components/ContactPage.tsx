'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getCountryConfig } from '@/config/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CookieConsent } from '@/components/features/CookieConsent';
import { Footer } from '@/components/ui/footer';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Menu,
  X,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface ContactPageProps {
  locale: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage({ locale }: ContactPageProps) {
  const t = useTranslations();
  const countryConfig = getCountryConfig(locale);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = t('forms.required_field');
    }

    if (!formData.email.trim()) {
      errors.email = t('forms.required_field');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('forms.invalid_email');
    }

    if (!formData.phone.trim()) {
      errors.phone = t('forms.required_field');
    }

    if (!formData.subject) {
      errors.subject = t('forms.required_field');
    }

    if (!formData.message.trim()) {
      errors.message = t('forms.required_field');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the form data to your API
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const subjectOptions = [
    { value: 'general', label: t('contact.subject_general') },
    { value: 'product', label: t('contact.subject_product') },
    { value: 'order', label: t('contact.subject_order') },
    { value: 'technical', label: t('contact.subject_technical') },
    { value: 'complaint', label: t('contact.subject_complaint') },
    { value: 'suggestion', label: t('contact.subject_suggestion') }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Elegant Header - Matching Home Page */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href={`/${locale}`}>
                <Image
                  src={countryConfig.logo}
                  alt={t('ui.alt_logo')}
                  width={140}
                  height={45}
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2">
                <Link href={`/${locale}`}>
                  {t('navigation.home')}
                </Link>
              </Button>
              <Link href={`/${locale}#products`} className="text-gray-800 hover:text-brand-green font-medium transition-colors relative group">
                {t('navigation.products')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full"></span>
              </Link>
              <Link href={`/${locale}#testimonials`} className="text-gray-800 hover:text-brand-green font-medium transition-colors relative group">
                {t('navigation.testimonials')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full"></span>
              </Link>
              <Link href={`/${locale}/contact`} className="text-gray-800 hover:text-brand-green font-medium transition-colors relative group">
                {t('navigation.contact')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-800 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4 mt-4 rounded-b-lg shadow-lg">
              <nav className="flex flex-col space-y-4">
                <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white w-full">
                  <Link href={`/${locale}`}>
                    {t('navigation.home')}
                  </Link>
                </Button>
                <Link href={`/${locale}#products`} className="text-gray-800 hover:text-brand-green font-medium transition-colors">
                  {t('navigation.products')}
                </Link>
                <Link href={`/${locale}#testimonials`} className="text-gray-800 hover:text-brand-green font-medium transition-colors">
                  {t('navigation.testimonials')}
                </Link>
                <Link href={`/${locale}/contact`} className="text-gray-800 hover:text-brand-green font-medium transition-colors">
                  {t('navigation.contact')}
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Matching Home Page Style */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-brand-green/15 to-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-56 h-56 bg-gradient-to-r from-brand-orange/15 to-orange-300/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-200/20 to-cyan-200/15 rounded-full blur-xl animate-bounce delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-r from-green-300/20 to-emerald-300/15 rounded-full blur-lg animate-ping delay-700"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-brand-orange/30 rounded-full animate-float delay-200"></div>
          <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-brand-green/25 rounded-full animate-float delay-1500"></div>
          <div className="absolute top-1/4 right-1/2 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-800"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-24">
          <div className="min-h-[80vh] flex items-center">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-brand-green/10 to-emerald-100/50 border border-brand-green/20 rounded-full text-sm font-medium text-brand-green animate-fadeInUp mb-8">
                <MessageSquare className="w-4 h-4 mr-2" />
                {t('contact.get_in_touch')}
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-[1.1] mb-6 animate-fadeInUp">
                {t('contact.page_title')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                {t('contact.page_subtitle')}
              </p>
              <p className="text-base text-gray-500 max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                {t('contact.contact_description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-gray-50">
        {/* Main Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-12">
                
                {/* Contact Form - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-brand-orange" />
                        </div>
                        {t('contact.contact_form_title')}
                      </CardTitle>
                      <p className="text-gray-600">{t('contact.contact_form_subtitle')}</p>
                    </CardHeader>
                    <CardContent>
                      {submitStatus === 'success' ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {t('contact.contact_success_title')}
                          </h3>
                          <p className="text-gray-600 mb-6">
                            {t('contact.contact_success_message')}
                          </p>
                          <Button 
                            onClick={() => setSubmitStatus('idle')}
                            variant="outline"
                            className="border-gray-300"
                          >
                            {t('contact.form_submit')}
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                                {t('contact.form_name')} *
                              </Label>
                              <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`${formErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                                placeholder={t('placeholders.full_name')}
                              />
                              {formErrors.name && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                              )}
                            </div>

                            {/* Email */}
                            <div>
                              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                                {t('contact.form_email')} *
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`${formErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                                placeholder={t('placeholders.email')}
                              />
                              {formErrors.email && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Phone */}
                            <div>
                              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                                {t('contact.form_phone')} *
                              </Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={`${formErrors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                                placeholder={t('placeholders.phone')}
                              />
                              {formErrors.phone && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.phone}</p>
                              )}
                            </div>

                            {/* Subject */}
                            <div>
                              <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">
                                {t('contact.form_subject')} *
                              </Label>
                              <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                                <SelectTrigger className={`${formErrors.subject ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}>
                                  <SelectValue placeholder={t('contact.subject_general')} />
                                </SelectTrigger>
                                <SelectContent>
                                  {subjectOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {formErrors.subject && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.subject}</p>
                              )}
                            </div>
                          </div>

                          {/* Message */}
                          <div>
                            <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                              {t('contact.form_message')} *
                            </Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              className={`min-h-[120px] ${formErrors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                              placeholder={t('placeholders.message')}
                            />
                            {formErrors.message && (
                              <p className="text-sm text-red-600 mt-1">{formErrors.message}</p>
                            )}
                          </div>

                          {/* Privacy Notice */}
                          <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border">
                            {t('contact.privacy_notice')}{' '}
                            <Link href={`/${locale}/legal/privacy-policy`} className="text-gray-700 hover:text-gray-900 underline">
                              {t('contact.privacy_policy_link')}
                            </Link>.
                          </div>

                          {/* Required Fields Notice */}
                          <p className="text-xs text-gray-500">{t('contact.required_fields')}</p>

                          {/* Submit Button */}
                          <div className="pt-4">
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  {t('contact.form_sending')}
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                  {t('contact.form_submit')}
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Error Message */}
                          {submitStatus === 'error' && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm">{t('contact.form_error')}</span>
                            </div>
                          )}
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information Sidebar */}
                <div className="space-y-8">
                  
                  {/* Contact Details */}
                  <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-6 h-6 bg-brand-green/10 rounded-full flex items-center justify-center">
                          <Phone className="h-3 w-3 text-brand-green" />
                        </div>
                        {t('contact.contact_info_title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <MapPin className="h-4 w-4 text-brand-green" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{t('contact.office_address')}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {countryConfig.company.address}<br />
                            {countryConfig.company.city} {countryConfig.company.postalCode}<br />
                            {countryConfig.company.country}
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Phone className="h-4 w-4 text-brand-orange" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{t('contact.phone_number')}</h4>
                          <p className="text-sm text-gray-600">
                            <a href={`tel:${countryConfig.company.phone}`} className="hover:text-brand-orange transition-colors">
                              {countryConfig.company.phone}
                            </a>
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{t('contact.email_address')}</h4>
                          <p className="text-sm text-gray-600">
                            <a href={`mailto:${countryConfig.company.email}`} className="hover:text-blue-600 transition-colors">
                              {countryConfig.company.email}
                            </a>
                          </p>
                        </div>
                      </div>

                      {/* Working Hours */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{t('contact.working_hours')}</h4>
                          <p className="text-sm text-gray-600">
                            {t('contact.working_hours_value')}<br />
                            {t('contact.working_hours_weekend')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Support Information */}
                  <Card className="bg-gradient-to-br from-brand-green/5 to-emerald-50 border border-brand-green/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="w-6 h-6 bg-brand-green/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-brand-green" />
                        </div>
                        {t('contact.customer_support')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t('contact.support_description')}
                      </p>
                      
                      <div className="pt-2 bg-white/50 rounded-lg p-3 border border-brand-green/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{t('contact.response_time')}</span>
                          <span className="font-semibold text-brand-green">24h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* FAQ Link */}
                  <Link href={`/${locale}#faq`}>
                    <Card className="bg-gradient-to-r from-brand-orange/5 to-orange-50 border-2 border-brand-orange/20 hover:border-brand-orange/40 transition-colors cursor-pointer shadow-lg hover:shadow-xl duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <MessageSquare className="h-4 w-4 text-brand-orange" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">{t('contact.faq_link')}</h4>
                              <p className="text-sm text-gray-600">{t('contact.faq_description')}</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-brand-orange" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer countryConfig={countryConfig} locale={locale} />

      {/* GDPR Cookie Consent for EU */}
      <CookieConsent isEU={countryConfig.isEU} />
    </div>
  );
}