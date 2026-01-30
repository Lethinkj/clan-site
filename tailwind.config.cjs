module.exports = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				blue: {
					'50': '#f8f5fe',
					'100': '#f0eafd',
					'200': '#e2d6fb',
					'300': '#cbb6f7',
					'400': '#af8cf2',
					'500': '#9461eb',
					'600': '#7f3ee0',
					'700': '#6e2cc7',
					'800': '#5d25a8', // Rich purple
					'900': '#4c2089', // Deep noble purple
					'950': '#0f0518', // Void background
				},
				amber: {
					'50': '#fffaeb',
					'100': '#fef3c7',
					'200': '#fde68a', /* Light Gold */
					'300': '#fcd34d', /* Gold */
					'400': '#fbbf24',
					'500': '#f59e0b', /* Deep Gold */
					'600': '#d97706',
					'700': '#b45309',
					'800': '#92400e',
					'900': '#78350f'
				},
				// Fantasy semantic tokens
				'void': '#05020a',
				'mythic': '#ffd700',
				cyan: {
					// Remapped to Arcane/Ice Blue for compatibility
					'50': '#f0f9ff',
					'100': '#e0f2fe',
					'200': '#bae6fd',
					'300': '#7dd3fc',
					'400': '#38bdf8',
					'500': '#0ea5e9',
					'600': '#0284c7',
					'700': '#0369a1',
					'800': '#075985',
					'900': '#0c4a6e'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			keyframes: {
				pulse: {
					'0%': {
						opacity: '0.2',
						transform: 'scale(0.9)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.1)'
					},
					'100%': {
						opacity: '0.2',
						transform: 'scale(0.9)'
					}
				}
			},
			animation: {
				pulse: 'pulse 3s ease-in-out infinite'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")]
};
