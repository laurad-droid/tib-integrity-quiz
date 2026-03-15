'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { register } from '../actions';

function RegisterForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const success = searchParams.get('success');

  return (
    <div className="min-h-screen bg-ti-bg dark:bg-ti-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-ti-dark-card rounded-[4px] border border-ti-grey-mid dark:border-ti-dark-border shadow-md p-8">
          {/* Logo / Brand Area */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-heading text-ti-navy dark:text-ti-dark-text">
              Transparency International Belgium
            </h1>
            <p className="text-ti-text-muted dark:text-ti-dark-muted mt-2 text-sm">
              Integrity Self-Assessment Tool
            </p>
          </div>

          <h2 className="text-xl font-semibold font-heading text-ti-navy dark:text-ti-dark-text mb-6 text-center">
            Create Account
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm">
              Registration successful! Please check your email to confirm your
              account.
            </div>
          )}

          {/* Registration Form */}
          {!success && (
            <form action={register} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ti-navy dark:text-ti-dark-text mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-ti-grey-mid dark:border-ti-dark-border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-ti-red focus:border-transparent bg-white dark:bg-ti-dark-bg dark:text-ti-dark-text"
                  placeholder="you@organization.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-ti-navy dark:text-ti-dark-text mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-ti-grey-mid dark:border-ti-dark-border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-ti-red focus:border-transparent bg-white dark:bg-ti-dark-bg dark:text-ti-dark-text"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="organization_name"
                  className="block text-sm font-medium text-ti-navy dark:text-ti-dark-text mb-1"
                >
                  Organisation Name
                </label>
                <input
                  id="organization_name"
                  name="organization_name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-ti-grey-mid dark:border-ti-dark-border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-ti-red focus:border-transparent bg-white dark:bg-ti-dark-bg dark:text-ti-dark-text"
                  placeholder="Your organisation"
                />
              </div>

              <div>
                <label
                  htmlFor="sector"
                  className="block text-sm font-medium text-ti-navy dark:text-ti-dark-text mb-1"
                >
                  Sector
                </label>
                <select
                  id="sector"
                  name="sector"
                  required
                  defaultValue=""
                  className="w-full px-3 py-2 border border-ti-grey-mid dark:border-ti-dark-border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-ti-red focus:border-transparent bg-white dark:bg-ti-dark-bg dark:text-ti-dark-text"
                >
                  <option value="" disabled>
                    Select your sector
                  </option>
                  <option value="government">Government</option>
                  <option value="private">Private Sector</option>
                  <option value="ngo">NGO / Civil Society</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-ti-red hover:bg-ti-red-dark text-white font-bold uppercase tracking-wide py-2 px-4 rounded-[4px] transition-colors focus:outline-none focus:ring-2 focus:ring-ti-red focus:ring-offset-2"
              >
                Register
              </button>
            </form>
          )}

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-ti-text-muted dark:text-ti-dark-muted">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-ti-red dark:text-ti-navy-light font-medium hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ti-bg dark:bg-ti-dark-bg flex items-center justify-center">
          <div className="text-ti-text-muted dark:text-ti-dark-muted">Loading...</div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
