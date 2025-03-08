
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				wraith: {
					DEFAULT: '#1a1a1a',
					muted: '#2a2a2a',
					foreground: '#ffffff',
					accent: '#8B5CF6',
					hover: '#9B69FD'
				},
				badges: {
					blue: '#3b82f6',
					purple: '#8b5cf6',
					pink: '#ec4899',
					green: '#10b981',
					orange: '#f97316',
					red: '#ef4444',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'scale': {
					'0%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-2deg)' },
					'50%': { transform: 'rotate(2deg)' }
				},
				'rainbow': {
					'0%': { filter: 'hue-rotate(0deg)' },
					'100%': { filter: 'hue-rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-up': 'fade-up 0.4s ease-out',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'scale': 'scale 0.2s ease-out',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'rainbow': 'rainbow 3s linear infinite'
			},
			textShadow: {
				'sm': '0 1px 2px rgba(0, 0, 0, 0.25)',
				'DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.25)',
				'lg': '0 0 8px rgba(139, 92, 246, 0.5), 0 0 16px rgba(139, 92, 246, 0.3)',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function ({ addUtilities }: { addUtilities: Function }) {
			const newUtilities = {
				'.text-shadow': {
					'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.25)'
				},
				'.text-shadow-md': {
					'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.25)'
				},
				'.text-shadow-lg': {
					'text-shadow': '0 0 8px rgba(139, 92, 246, 0.5), 0 0 16px rgba(139, 92, 246, 0.3)'
				},
				'.text-shadow-none': {
					'text-shadow': 'none'
				},
			};
			addUtilities(newUtilities);
		},
	],
} satisfies Config;
