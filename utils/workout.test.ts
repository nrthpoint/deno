import { calculatePace } from "./workout";
import { WorkoutSample, Quantity } from "@kingstinct/react-native-healthkit";

describe("Workout Utilities", () => {
  describe("calculatePace", () => {
    it("should calculate pace correctly for a run in kilometers", () => {
      const mockRun = {
        totalDistance: { unit: "km", quantity: 5 } as Quantity,
        duration: { unit: "m", quantity: 25 } as Quantity, // 25 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe("min/km");
      expect(result.quantity).toBe(5); // 25 minutes / 5 km = 5 min/km
    });

    it("should calculate pace correctly for a run in miles", () => {
      const mockRun = {
        totalDistance: { unit: "mi", quantity: 3 } as Quantity,
        duration: { unit: "m", quantity: 24 } as Quantity, // 24 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe("min/mi");
      expect(result.quantity).toBe(8); // 24 minutes / 3 miles = 8 min/mile
    });

    it("should handle duration in seconds", () => {
      const mockRun = {
        totalDistance: { unit: "km", quantity: 2 } as Quantity,
        duration: { unit: "s", quantity: 600 } as Quantity, // 600 seconds = 10 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe("min/km");
      expect(result.quantity).toBe(5); // 10 minutes / 2 km = 5 min/km
    });

    it("should handle zero distance gracefully", () => {
      const mockRun = {
        totalDistance: { unit: "km", quantity: 0 } as Quantity,
        duration: { unit: "m", quantity: 30 } as Quantity,
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe("min/km");
      expect(result.quantity).toBe(0);
    });

    it("should handle missing distance gracefully", () => {
      const mockRun = {
        totalDistance: undefined,
        duration: { unit: "m", quantity: 30 } as Quantity,
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe("min/undefined");
      expect(result.quantity).toBe(0);
    });

    it("should round pace to 2 decimal places", () => {
      const mockRun = {
        totalDistance: { unit: "km", quantity: 3 } as Quantity,
        duration: { unit: "m", quantity: 20 } as Quantity, // 20 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe("min/km");
      expect(result.quantity).toBe(6.67); // 20 / 3 = 6.666... rounded to 6.67
    });

    it("should handle fractional distances", () => {
      const mockRun = {
        totalDistance: { unit: "mi", quantity: 1.5 } as Quantity,
        duration: { unit: "m", quantity: 12 } as Quantity, // 12 minutes
      } as WorkoutSample;

      const result = calculatePace(mockRun);

      expect(result.unit).toBe("min/mi");
      expect(result.quantity).toBe(8); // 12 / 1.5 = 8 min/mile
    });
  });
});
