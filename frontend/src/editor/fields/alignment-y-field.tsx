import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { AlignCenterHorizontal, AlignEndHorizontal, AlignStartHorizontal } from 'lucide-react';

// Options interface for the AlignmentYField component
export interface AlignmentYFieldOptions {
  label?: string; // Custom label for the field
  defaultValue?: 'top' | 'center' | 'bottom'; // Default alignment value
}

// System color for active state (blue)
const systemColor = '#3b82f6';

// Custom field component for horizontal alignment selection
export function AlignmentYField(options?: AlignmentYFieldOptions) {
  // Extract options with defaults
  const { label = 'Alinhamento eixo Y', defaultValue = 'center' } = options || {};

  return {
    label,
    type: 'custom' as const,
    render: ({
      value,
      onChange,
    }: {
      value?: 'top' | 'center' | 'bottom';
      onChange: (val: 'top' | 'center' | 'bottom') => void;
    }) => {
      // Alignment options with icons
      const fieldOptions = [
        { label: '', value: 'top', icon: AlignStartHorizontal },
        { label: '', value: 'center', icon: AlignCenterHorizontal },
        { label: '', value: 'bottom', icon: AlignEndHorizontal },
      ];

      // Use current value or defaultValue as fallback
      const currentValue = value || defaultValue;

      return (
        // Main container with Horizontal layout
        <>
          <div className="flex flex-col gap-2">
            {/* Field label */}
            <span style={{ color: '#5A5A5A' }} className="text-sm font-semibold">
              {label}
            </span>
            <ButtonGroup fullWidth className="w-full">
              {fieldOptions.map((opt) => {
                const Icon = opt.icon;
                // Check if this option is currently active
                const isActive = currentValue === opt.value;
                return (
                  <>
                    <Button
                      key={opt.value}
                      onClick={() => onChange(opt.value as 'top' | 'center' | 'bottom')}
                      variant="outline"
                      title={opt.label}
                      style={{
                        border: `2px solid ${isActive ? systemColor : '#eee'}`,
                      }}
                      className="flex w-[33.33%] items-center justify-center"
                    >
                      {/* Icon with color based on active state */}
                      <Icon size={16} color={isActive ? systemColor : '#666'} />

                      {/* Optional text label (currently empty) */}
                      {opt.label && (
                        <span
                          style={{
                            fontSize: '10px',
                            color: isActive ? systemColor : '#666',
                            fontWeight: isActive ? 600 : 400,
                          }}
                        >
                          {opt.label}
                        </span>
                      )}
                    </Button>
                  </>
                );
              })}
            </ButtonGroup>
          </div>
        </>
      );
    },
  };
}
