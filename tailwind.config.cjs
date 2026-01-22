module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			blue: {
  				'50': '#f5f8ff',
  				'100': '#0b2545',
  				'200': '#123a6b',
  				'300': '#1b5bb0',
  				'400': '#2a7fe0',
  				'500': '#2563eb',
  				'600': '#1f4fb8',
  				'700': '#17366f',
  				'800': '#0f2547',
  				'900': '#07122a'
  			},
  			yellow: {
  				'50': '#fffaf0',
  				'100': '#fff3cc',
  				'200': '#f6d36b',
  				'300': '#fbbf24',
  				'400': '#f59e0b',
  				'500': '#d99a00',
  				'600': '#b38600',
  				'700': '#8b6500',
  				'800': '#634500',
  				'900': '#3f2a00'
  			},
  			cyan: {
  				'50': '#ecfeff',
  				'100': '#cffafe',
  				'200': '#a5f3fc',
  				'300': '#67e8f9',
  				'400': '#22d3ee',
  				'500': '#06b6d4',
  				'600': '#0891b2',
  				'700': '#0e7490',
  				'800': '#155e75',
  				'900': '#164e63'
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
