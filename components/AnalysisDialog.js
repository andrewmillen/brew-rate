"use client";

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";

const AnalysisDialog = ({ isOpen, onClose, entries }) => {
  console.log("AnalysisDialog rendered with:", {
    isOpen,
    entriesLength: entries?.length,
  });

  const analyzeEntries = () => {
    try {
      if (!entries || entries.length < 3) {
        return {
          canAnalyze: false,
          message:
            "Not enough entries to analyze preferences. Please log at least 3 coffee experiences.",
        };
      }

      // Group entries by different attributes and calculate average ratings
      const analysis = {
        origins: {},
        roasters: {},
        aromas: {},
        tastes: {},
      };

      // Track all unique attributes for recommendations
      const allOrigins = new Set();
      const allRoasters = new Set();

      entries.forEach((entry) => {
        // Process origin
        if (entry.origin) {
          allOrigins.add(entry.origin);
          if (!analysis.origins[entry.origin]) {
            analysis.origins[entry.origin] = {
              count: 0,
              totalRating: 0,
              entries: [],
            };
          }
          analysis.origins[entry.origin].count++;
          analysis.origins[entry.origin].totalRating += Number(
            entry.rating || 0
          );
          analysis.origins[entry.origin].entries.push(entry);
        }

        // Process roaster
        if (entry.roaster) {
          allRoasters.add(entry.roaster);
          if (!analysis.roasters[entry.roaster]) {
            analysis.roasters[entry.roaster] = {
              count: 0,
              totalRating: 0,
              entries: [],
            };
          }
          analysis.roasters[entry.roaster].count++;
          analysis.roasters[entry.roaster].totalRating += Number(
            entry.rating || 0
          );
          analysis.roasters[entry.roaster].entries.push(entry);
        }

        // Process aromas and taste notes
        if (entry.aroma) {
          if (!analysis.aromas[entry.aroma]) {
            analysis.aromas[entry.aroma] = {
              count: 0,
              totalRating: 0,
              entries: [],
            };
          }
          analysis.aromas[entry.aroma].count++;
          analysis.aromas[entry.aroma].totalRating += Number(entry.rating || 0);
          analysis.aromas[entry.aroma].entries.push(entry);
        }

        if (entry.taste) {
          if (!analysis.tastes[entry.taste]) {
            analysis.tastes[entry.taste] = {
              count: 0,
              totalRating: 0,
              entries: [],
            };
          }
          analysis.tastes[entry.taste].count++;
          analysis.tastes[entry.taste].totalRating += Number(entry.rating || 0);
          analysis.tastes[entry.taste].entries.push(entry);
        }
      });

      // Find top rated entries regardless of repetition
      const findTopRated = (category, minCount = 1) => {
        return Object.entries(analysis[category])
          .filter(([_, data]) => data.count >= minCount)
          .map(([name, data]) => ({
            name,
            avgRating: data.totalRating / data.count,
            count: data.count,
            entries: data.entries,
          }))
          .sort((a, b) => b.avgRating - a.avgRating)
          .slice(0, 3);
      };

      // For repeated patterns (traditional analysis)
      const topRepeatedOrigins = findTopRated("origins", 2);
      const topRepeatedRoasters = findTopRated("roasters", 2);

      // For single entries (to ensure we have something to show)
      const topOrigins = findTopRated("origins", 1);
      const topRoasters = findTopRated("roasters", 1);
      const topAromas = findTopRated("aromas", 1);
      const topTastes = findTopRated("tastes", 1);

      // Generate analysis text
      let summaryText =
        "Based on your coffee logs, here's what I've found:\n\n";
      let hasContent = false;

      // Show repeated patterns if available
      if (topRepeatedOrigins.length > 0) {
        summaryText += "Preferred Origins (tried multiple times):\n";
        topRepeatedOrigins.forEach((origin) => {
          summaryText += `- ${origin.name} (${origin.avgRating.toFixed(
            1
          )} avg rating from ${origin.count} entries)\n`;
        });
        summaryText += "\n";
        hasContent = true;
      }

      if (topRepeatedRoasters.length > 0) {
        summaryText += "Favorite Roasters (tried multiple times):\n";
        topRepeatedRoasters.forEach((roaster) => {
          summaryText += `- ${roaster.name} (${roaster.avgRating.toFixed(
            1
          )} avg rating from ${roaster.count} entries)\n`;
        });
        summaryText += "\n";
        hasContent = true;
      }

      // If no repeated patterns, show highest rated single entries
      if (!hasContent) {
        summaryText += "Your Highest Rated Coffees:\n\n";

        if (topOrigins.length > 0) {
          summaryText += "Top Rated Origins:\n";
          topOrigins.forEach((origin) => {
            summaryText += `- ${origin.name} (${origin.avgRating.toFixed(
              1
            )} rating)\n`;
          });
          summaryText += "\n";
        }

        if (topRoasters.length > 0) {
          summaryText += "Top Rated Roasters:\n";
          topRoasters.forEach((roaster) => {
            summaryText += `- ${roaster.name} (${roaster.avgRating.toFixed(
              1
            )} rating)\n`;
          });
          summaryText += "\n";
        }

        if (topAromas.length > 0) {
          summaryText += "Top Rated Aromas:\n";
          topAromas.forEach((aroma) => {
            summaryText += `- ${aroma.name} (${aroma.avgRating.toFixed(
              1
            )} rating)\n`;
          });
          summaryText += "\n";
        }

        if (topTastes.length > 0) {
          summaryText += "Top Rated Taste Notes:\n";
          topTastes.forEach((taste) => {
            summaryText += `- ${taste.name} (${taste.avgRating.toFixed(
              1
            )} rating)\n`;
          });
          summaryText += "\n";
        }

        // Add exploration suggestion
        summaryText +=
          "To get more personalized recommendations, try logging multiple entries from the same origins or roasters to establish preference patterns.\n\n";
      }

      // Generate recommendations based on available data
      const generateRecommendations = () => {
        try {
          const recommendations = [];

          // Use either repeated patterns or single entries for recommendations
          const bestOrigins =
            topRepeatedOrigins.length > 0 ? topRepeatedOrigins : topOrigins;
          const bestRoasters =
            topRepeatedRoasters.length > 0 ? topRepeatedRoasters : topRoasters;

          // Find origins you haven't tried from top roasters
          if (bestRoasters.length > 0) {
            const favoriteRoaster = bestRoasters[0].name;
            const triedOriginsFromFavoriteRoaster = new Set(
              entries
                .filter((e) => e.roaster === favoriteRoaster)
                .map((e) => e.origin)
            );

            const untriableOrigins = [...allOrigins].filter(
              (origin) => !triedOriginsFromFavoriteRoaster.has(origin)
            );

            if (untriableOrigins.length > 0) {
              recommendations.push({
                type: "roaster_origin",
                text: `Try ${untriableOrigins[0]} beans from ${favoriteRoaster}, since you rated their coffee highly.`,
              });
            }
          }

          // Find roasters you haven't tried for your favorite origin
          if (bestOrigins.length > 0) {
            const favoriteOrigin = bestOrigins[0].name;
            const triedRoastersForFavoriteOrigin = new Set(
              entries
                .filter((e) => e.origin === favoriteOrigin)
                .map((e) => e.roaster)
            );

            const untriableRoasters = [...allRoasters].filter(
              (roaster) => !triedRoastersForFavoriteOrigin.has(roaster)
            );

            if (untriableRoasters.length > 0) {
              recommendations.push({
                type: "origin_roaster",
                text: `Try ${favoriteOrigin} beans from ${untriableRoasters[0]}, since you rated this origin highly.`,
              });
            }
          }

          return recommendations;
        } catch (error) {
          console.error("Error generating recommendations:", error);
          return [];
        }
      };

      const recommendations = generateRecommendations();

      // Add recommendations section
      if (recommendations.length > 0) {
        summaryText += "Recommendations:\n";
        recommendations.forEach((rec) => {
          summaryText += `- ${rec.text}\n`;
        });
      }

      return {
        canAnalyze: true,
        message: summaryText,
      };
    } catch (error) {
      console.error("Error in analyzeEntries:", error);
      return {
        canAnalyze: false,
        message:
          "An error occurred while analyzing your coffee preferences: " +
          error.message,
      };
    }
  };

  if (!isOpen) return null;

  let analysis;
  try {
    analysis = analyzeEntries();
  } catch (error) {
    console.error("Error calling analyzeEntries:", error);
    analysis = {
      canAnalyze: false,
      message: "An error occurred while analyzing your coffee preferences.",
    };
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-50">
        <DialogPanel className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full mx-4 relative">
          <div className="p-6">
            <DialogTitle className="text-xl font-semibold mb-4">
              Coffee Preference Analysis
            </DialogTitle>
            <div className="whitespace-pre-line h-full max-h-96 overflow-y-auto">
              {analysis?.message || "No analysis available"}
            </div>
          </div>
          <div className="border-t border-gray-200 flex justify-end sticky bottom-0 bg-white p-4">
            <Button
              onClick={onClose}
              className="px-4 py-2 font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-gray-400"
            >
              Dismiss
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AnalysisDialog;
