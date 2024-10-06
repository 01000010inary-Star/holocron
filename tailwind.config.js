/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx", "./src/*.tsx"],
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
            },
            backgroundImage: {
                card: 'var(--card)',
            },
            fontSize: {
                lg: 'var(--font-size-lg)',
                md: 'var(--font-size-md)',
                sm: 'var(--font-size-sm)',
                xs: 'var(--font-size-xs)',
                xl: 'var(--font-size-xl)',
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
<<<<<<< HEAD
                    foreground: 'hsl(var(--card-foreground))',
=======
                    DEFAULT: "var(--card)",
                    foreground: "hsl(var(--card-foreground))",
>>>>>>> 0cde3b794b5b52af34fdc5a006a166c4b74b060e
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
