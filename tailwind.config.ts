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
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
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
				// Trading Platform Colors
				'trading-surface': 'hsl(var(--trading-surface))',
				'trading-border': 'hsl(var(--trading-border))',
				'trading-hover': 'hsl(var(--trading-hover))',
				'buy-primary': 'hsl(var(--buy-primary))',
				'buy-secondary': 'hsl(var(--buy-secondary))',
				'buy-muted': 'hsl(var(--buy-muted))',
				'sell-primary': 'hsl(var(--sell-primary))',
				'sell-secondary': 'hsl(var(--sell-secondary))',
				'sell-muted': 'hsl(var(--sell-muted))',
				'gold-accent': 'hsl(var(--gold-accent))',
				'blue-accent': 'hsl(var(--blue-accent))',
				'purple-accent': 'hsl(var(--purple-accent))',
			},
			backgroundImage: {
				'gradient-buy': 'var(--gradient-buy)',
				'gradient-sell': 'var(--gradient-sell)',
				'gradient-surface': 'var(--gradient-surface)',
				'gradient-gold': 'var(--gradient-gold)',
			},
			boxShadow: {
				'trading': 'var(--shadow-trading)',
				'glow-buy': 'var(--shadow-glow-buy)',
				'glow-sell': 'var(--shadow-glow-sell)',
			},
			transitionTimingFunction: {
				'trading': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
