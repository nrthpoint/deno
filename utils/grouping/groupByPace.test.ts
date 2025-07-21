import { groupRunsByPace } from "./groupByPace";
import { ExtendedWorkout } from "@/types/workout";
import { Quantity } from "@kingstinct/react-native-healthkit";

// Helper function to create mock workouts
const createMockWorkout = (
  averagePace: number,
  distance?: number,
  distanceUnit: string = "mi"
): ExtendedWorkout =>
  ({
    totalDistance: distance
      ? ({ unit: distanceUnit, quantity: distance } as Quantity)
      : ({ unit: "mi", quantity: 3 } as Quantity),
    averagePace: { unit: "min/mi", quantity: averagePace } as Quantity,
    daysAgo: "1 day ago",
    prettyPace: `${Math.floor(averagePace)}:${Math.round((averagePace % 1) * 60)
      .toString()
      .padStart(2, "0")}`,
  } as ExtendedWorkout);

// Helper function to create workout without pace
const createMockWorkoutWithoutPace = (): ExtendedWorkout =>
  ({
    totalDistance: { unit: "mi", quantity: 3 } as Quantity,
    averagePace: undefined,
    daysAgo: "1 day ago",
    prettyPace: "",
  } as unknown as ExtendedWorkout);

// Helper function to create workout without distance
const createMockWorkoutWithoutDistance = (
  averagePace: number
): ExtendedWorkout =>
  ({
    totalDistance: undefined,
    averagePace: { unit: "min/mi", quantity: averagePace } as Quantity,
    daysAgo: "1 day ago",
    prettyPace: `${Math.floor(averagePace)}:${Math.round((averagePace % 1) * 60)
      .toString()
      .padStart(2, "0")}`,
  } as unknown as ExtendedWorkout);

describe("groupRunsByPace", () => {
  describe("basic functionality", () => {
    it("should group runs by nearest whole minute pace", () => {
      const runs = [
        createMockWorkout(7.3, 3), // Should be grouped as 7 min/mile
        createMockWorkout(7.4, 5), // Should be grouped as 7 min/mile
        createMockWorkout(8.1, 4), // Should be grouped as 8 min/mile
        createMockWorkout(8.2, 6), // Should be grouped as 8 min/mile
      ];

      const result = groupRunsByPace(runs);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result[7]).toBeDefined();
      expect(result[8]).toBeDefined();
      expect(result[7].runs).toHaveLength(2);
      expect(result[8].runs).toHaveLength(2);
    });

    it("should create correct group titles", () => {
      const runs = [createMockWorkout(7.3)];

      const result = groupRunsByPace(runs);

      expect(result[7].title).toBe("7 min/mile");
    });

    it("should set the longest distance run as highlight", () => {
      const runs = [
        createMockWorkout(7.3, 3), // 3 miles
        createMockWorkout(7.4, 5), // 5 miles - should be highlight
        createMockWorkout(7.2, 4), // 4 miles
      ];

      const result = groupRunsByPace(runs);

      expect(result[7].highlight).toBe(runs[1]); // The 5-mile run
    });
  });

  describe("tolerance behavior", () => {
    it("should use default tolerance of 0.5", () => {
      const runs = [
        createMockWorkout(7.5, 3), // 7.5 rounds to 8, diff = 0.5, exactly at tolerance
        createMockWorkout(7.49, 3), // 7.49 rounds to 7, diff = 0.49, within tolerance
      ];

      const result = groupRunsByPace(runs);

      expect(result[8]).toBeDefined();
      expect(result[7]).toBeDefined();
      expect(result[8].runs).toHaveLength(1); // First run (7.5 -> 8)
      expect(result[7].runs).toHaveLength(1); // Second run (7.49 -> 7)
    });

    it("should respect custom tolerance", () => {
      const runs = [
        createMockWorkout(7.6, 3), // 7.6 rounds to 8, diff = 0.4, outside tolerance 0.3
        createMockWorkout(7.8, 3), // 7.8 rounds to 8, diff = 0.2, within tolerance 0.3
      ];

      const result = groupRunsByPace(runs, 0.3); // Custom tolerance of 0.3

      expect(result[8]).toBeDefined();
      expect(result[8].runs).toHaveLength(1); // Only the second run should be included
    });

    it("should exclude runs outside tolerance", () => {
      const runs = [
        createMockWorkout(7.6, 3), // 7.6 rounds to 8, diff = 0.4, within default tolerance of 0.5
      ];

      const result = groupRunsByPace(runs, 0.3); // Custom tolerance smaller than 0.4

      expect(Object.keys(result)).toHaveLength(0); // Should be excluded since 0.4 > 0.3
    });
  });

  describe("highlight selection - longest distance", () => {
    it("should set the first run as initial highlight", () => {
      const runs = [createMockWorkout(7.3, 5)];

      const result = groupRunsByPace(runs);

      expect(result[7].highlight).toBe(runs[0]);
    });

    it("should update highlight to longest distance run", () => {
      const runs = [
        createMockWorkout(7.3, 3), // 3 miles
        createMockWorkout(7.4, 6), // 6 miles - should become highlight
        createMockWorkout(7.2, 4), // 4 miles
      ];

      const result = groupRunsByPace(runs);

      expect(result[7].highlight).toBe(runs[1]); // The 6-mile run
    });

    it("should handle runs with same distance", () => {
      const runs = [
        createMockWorkout(7.3, 5), // 5 miles - first one should stay as highlight
        createMockWorkout(7.4, 5), // 5 miles - same distance
      ];

      const result = groupRunsByPace(runs);

      expect(result[7].highlight).toBe(runs[0]); // First one remains highlight
    });
  });

  describe("data validation", () => {
    it("should skip runs without averagePace", () => {
      const runs = [
        createMockWorkout(7.3),
        createMockWorkoutWithoutPace(),
        createMockWorkout(8.2),
      ];

      const result = groupRunsByPace(runs);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result[7].runs).toHaveLength(1);
      expect(result[8].runs).toHaveLength(1);
    });

    it("should skip runs without totalDistance", () => {
      const runs = [
        createMockWorkout(7.3, 5),
        createMockWorkoutWithoutDistance(7.4),
        createMockWorkout(8.2, 3),
      ];

      const result = groupRunsByPace(runs);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result[7].runs).toHaveLength(1);
      expect(result[8].runs).toHaveLength(1);
    });

    it("should handle runs with null/undefined pace and distance gracefully", () => {
      const runs = [
        createMockWorkout(7.3),
        createMockWorkoutWithoutPace(),
        createMockWorkoutWithoutDistance(8.2),
      ];

      const result = groupRunsByPace(runs);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[7]).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("should handle empty array", () => {
      const result = groupRunsByPace([]);

      expect(result).toEqual({});
    });

    it("should handle single run", () => {
      const runs = [createMockWorkout(8.0, 5)];

      const result = groupRunsByPace(runs);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[8].runs).toHaveLength(1);
      expect(result[8].highlight).toBe(runs[0]);
    });

    it("should handle very fast paces", () => {
      const runs = [createMockWorkout(4.8, 5)]; // Sub-5-minute mile

      const result = groupRunsByPace(runs);

      expect(result[5]).toBeDefined();
      expect(result[5].runs).toHaveLength(1);
    });

    it("should handle very slow paces", () => {
      const runs = [createMockWorkout(12.3, 5)]; // 12+ minute mile

      const result = groupRunsByPace(runs);

      expect(result[12]).toBeDefined();
      expect(result[12].runs).toHaveLength(1);
    });

    it("should handle zero pace gracefully", () => {
      const runs = [createMockWorkout(0.0, 5)];

      const result = groupRunsByPace(runs);

      expect(result[0]).toBeDefined();
      expect(result[0].runs).toHaveLength(1);
    });
  });

  describe("multiple runs per group", () => {
    it("should handle multiple runs in the same pace group", () => {
      const runs = [
        createMockWorkout(8.0, 3),
        createMockWorkout(8.1, 5),
        createMockWorkout(7.9, 4),
        createMockWorkout(8.2, 6),
      ];

      const result = groupRunsByPace(runs);

      expect(result[8].runs).toHaveLength(4);
      expect(result[8].runs).toContain(runs[0]);
      expect(result[8].runs).toContain(runs[1]);
      expect(result[8].runs).toContain(runs[2]);
      expect(result[8].runs).toContain(runs[3]);
      expect(result[8].highlight).toBe(runs[3]); // 6-mile run is longest
    });
  });

  describe("console warnings", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it("should log warning for runs outside tolerance", () => {
      const runs = [createMockWorkout(7.6)]; // Outside tolerance of 0.3

      groupRunsByPace(runs, 0.3);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "Run with pace 7.6 min/mile is not close enough to a whole minute. Skipping."
        )
      );
    });

    it("should not log warning for runs within tolerance", () => {
      const runs = [createMockWorkout(7.4)]; // Within tolerance

      groupRunsByPace(runs);

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe("comparison with distance grouping", () => {
    it("should group different distances with same pace together", () => {
      const runs = [
        createMockWorkout(7.3, 3), // 3 miles at ~7 min/mile
        createMockWorkout(7.4, 5), // 5 miles at ~7 min/mile
        createMockWorkout(7.2, 10), // 10 miles at ~7 min/mile
      ];

      const result = groupRunsByPace(runs);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[7].runs).toHaveLength(3);
      expect(result[7].highlight).toBe(runs[2]); // 10-mile run is longest
    });
  });
});
