/**
 * Indian Police Physical Measurement Test (PMT) & Physical Efficiency Test (PET) Standards.
 * Covers Bihar, Delhi, Haryana, Karnataka, Maharashtra, Rajasthan, and Uttar Pradesh.
 */
const STATE_STANDARDS = {
  delhi: {
    name: "Delhi Police",
    posts: {
      constable: {
        name: "Constable",
        male: {
          pmt: {
            height: { min: 170, label: "Height (cm)", unit: "cm" },
            chest: { min: 81, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 85, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1600, limitSeconds: 360, label: "1600m Run", unit: "min:sec", placeholder: "06:00" },
            longJump: { target: 14.0, label: "Long Jump", unit: "feet", placeholder: "14.0" },
            highJump: { target: 3.75, label: "High Jump", unit: "feet", placeholder: "3.75" }
          }
        },
        female: {
          pmt: {
            height: { min: 157, label: "Height (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1600, limitSeconds: 480, label: "1600m Run", unit: "min:sec", placeholder: "08:00" },
            longJump: { target: 10.0, label: "Long Jump", unit: "feet", placeholder: "10.0" },
            highJump: { target: 3.0, label: "High Jump", unit: "feet", placeholder: "3.0" }
          }
        }
      },
      si: {
        name: "Sub-Inspector (SI)",
        male: {
          pmt: {
            height: { min: 170, label: "Height (cm)", unit: "cm" },
            chest: { min: 80, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 85, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1600, limitSeconds: 390, label: "1600m Run", unit: "min:sec", placeholder: "06:30" },
            run100m: { target: 100, limitSeconds: 16.0, label: "100m Sprint", unit: "sec", placeholder: "16.0" },
            longJump: { target: 12.0, label: "Long Jump (3.65m)", unit: "feet", placeholder: "12.0" },
            highJump: { target: 3.93, label: "High Jump (1.2m)", unit: "feet", placeholder: "3.9" },
            shotPut: { target: 14.76, label: "Shot Put (16 lbs)", unit: "feet", placeholder: "14.8" }
          }
        },
        female: {
          pmt: {
            height: { min: 157, label: "Height (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 800, limitSeconds: 240, label: "800m Run", unit: "min:sec", placeholder: "04:00" },
            run100m: { target: 100, limitSeconds: 18.0, label: "100m Sprint", unit: "sec", placeholder: "18.0" },
            longJump: { target: 8.85, label: "Long Jump (2.7m)", unit: "feet", placeholder: "8.9" },
            highJump: { target: 2.95, label: "High Jump (0.9m)", unit: "feet", placeholder: "3.0" }
          }
        }
      }
    }
  },
  bihar: {
    name: "Bihar Police",
    posts: {
      constable: {
        name: "Constable",
        male: {
          pmt: {
            height: { min: 165, label: "Height (cm)", unit: "cm" },
            chest: { min: 81, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 86, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1600, limitSeconds: 360, label: "1.6 Km Run", unit: "min:sec", placeholder: "06:00" },
            highJump: { target: 4.0, label: "High Jump", unit: "feet", placeholder: "4.0" },
            shotPut: { target: 16.0, label: "Shot Put (16 lbs)", unit: "feet", placeholder: "16.0" }
          }
        },
        female: {
          pmt: {
            height: { min: 155, label: "Height (cm)", unit: "cm" },
            weight: { min: 48, label: "Weight (kg)", unit: "kg" }
          },
          pet: {
            run: { target: 1000, limitSeconds: 300, label: "1 Km Run", unit: "min:sec", placeholder: "05:00" },
            highJump: { target: 3.0, label: "High Jump", unit: "feet", placeholder: "3.0" },
            shotPut: { target: 10.0, label: "Shot Put (12 lbs)", unit: "feet", placeholder: "10.0" }
          }
        }
      },
      si: {
        name: "Sub-Inspector (SI)",
        male: {
          pmt: {
            height: { min: 165, label: "Height (cm)", unit: "cm" },
            chest: { min: 81, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 86, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1600, limitSeconds: 390, label: "1.6 Km Run", unit: "min:sec", placeholder: "06:30" },
            longJump: { target: 12.0, label: "Long Jump", unit: "feet", placeholder: "12.0" },
            highJump: { target: 4.0, label: "High Jump", unit: "feet", placeholder: "4.0" },
            shotPut: { target: 16.0, label: "Shot Put (16 lbs)", unit: "feet", placeholder: "16.0" }
          }
        },
        female: {
          pmt: {
            height: { min: 155, label: "Height (cm)", unit: "cm" },
            weight: { min: 48, label: "Weight (kg)", unit: "kg" }
          },
          pet: {
            run: { target: 1000, limitSeconds: 360, label: "1 Km Run", unit: "min:sec", placeholder: "06:00" },
            longJump: { target: 9.0, label: "Long Jump", unit: "feet", placeholder: "9.0" },
            highJump: { target: 3.0, label: "High Jump", unit: "feet", placeholder: "3.0" },
            shotPut: { target: 10.0, label: "Shot Put (12 lbs)", unit: "feet", placeholder: "10.0" }
          }
        }
      }
    }
  },
  up: {
    name: "Uttar Pradesh (UP) Police",
    posts: {
      constable: {
        name: "Constable",
        male: {
          pmt: {
            height: { min: 168, label: "Height (cm)", unit: "cm" },
            chest: { min: 79, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 84, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 4800, limitSeconds: 1500, label: "4.8 Km Run", unit: "min:sec", placeholder: "25:00" }
          }
        },
        female: {
          pmt: {
            height: { min: 152, label: "Height (cm)", unit: "cm" },
            weight: { min: 40, label: "Weight (kg)", unit: "kg" }
          },
          pet: {
            run: { target: 2400, limitSeconds: 840, label: "2.4 Km Run", unit: "min:sec", placeholder: "14:00" }
          }
        }
      },
      si: {
        name: "Sub-Inspector (SI)",
        male: {
          pmt: {
            height: { min: 168, label: "Height (cm)", unit: "cm" },
            chest: { min: 79, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 84, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 4800, limitSeconds: 1680, label: "4.8 Km Run", unit: "min:sec", placeholder: "28:00" }
          }
        },
        female: {
          pmt: {
            height: { min: 152, label: "Height (cm)", unit: "cm" },
            weight: { min: 40, label: "Weight (kg)", unit: "kg" }
          },
          pet: {
            run: { target: 2400, limitSeconds: 960, label: "2.4 Km Run", unit: "min:sec", placeholder: "16:00" }
          }
        }
      }
    }
  },
  maharashtra: {
    name: "Maharashtra Police",
    posts: {
      constable: {
        name: "Constable",
        male: {
          pmt: {
            height: { min: 165, label: "Height (cm)", unit: "cm" },
            chest: { min: 79, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 84, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1600, limitSeconds: 330, label: "1600m Run", unit: "min:sec", placeholder: "05:30" },
            run100m: { target: 100, limitSeconds: 15.0, label: "100m Sprint", unit: "sec", placeholder: "15.0" },
            shotPut: { target: 19.68, label: "Shot Put (7.26 kg)", unit: "feet", placeholder: "19.7" }
          }
        },
        female: {
          pmt: {
            height: { min: 155, label: "Height (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 800, limitSeconds: 240, label: "800m Run", unit: "min:sec", placeholder: "04:00" },
            run100m: { target: 100, limitSeconds: 17.5, label: "100m Sprint", unit: "sec", placeholder: "17.5" },
            shotPut: { target: 19.68, label: "Shot Put (4 kg)", unit: "feet", placeholder: "19.7" }
          }
        }
      },
      si: {
        name: "Sub-Inspector (PSI)",
        male: {
          pmt: {
            height: { min: 165, label: "Height (cm)", unit: "cm" },
            chest: { min: 79, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 84, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 800, limitSeconds: 180, label: "800m Run", unit: "min:sec", placeholder: "03:00" },
            pullUps: { target: 4, label: "Pull-ups (Reps)", unit: "reps", placeholder: "4" },
            longJump: { target: 12.46, label: "Long Jump (3.8m)", unit: "feet", placeholder: "12.5" },
            shotPut: { target: 19.68, label: "Shot Put (7.26 kg, 6m)", unit: "feet", placeholder: "19.7" }
          }
        },
        female: {
          pmt: {
            height: { min: 157, label: "Height (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 400, limitSeconds: 90, label: "400m Run", unit: "min:sec", placeholder: "01:30" },
            longJump: { target: 9.84, label: "Long Jump (3m)", unit: "feet", placeholder: "9.8" },
            shotPut: { target: 19.68, label: "Shot Put (4 kg, 6m)", unit: "feet", placeholder: "19.7" }
          }
        }
      }
    }
  },
  haryana: {
    name: "Haryana Police",
    posts: {
      constable: {
        name: "Constable",
        male: {
          pmt: {
            height: { min: 170, label: "Height (cm)", unit: "cm" },
            chest: { min: 83, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 87, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 2500, limitSeconds: 720, label: "2.5 Km Run", unit: "min:sec", placeholder: "12:00" }
          }
        },
        female: {
          pmt: {
            height: { min: 158, label: "Height (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1000, limitSeconds: 360, label: "1.0 Km Run", unit: "min:sec", placeholder: "06:00" }
          }
        }
      },
      si: {
        name: "Sub-Inspector (SI)",
        male: {
          pmt: {
            height: { min: 170, label: "Height (cm)", unit: "cm" },
            chest: { min: 83, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 87, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 2500, limitSeconds: 720, label: "2.5 Km Run", unit: "min:sec", placeholder: "12:00" }
          }
        },
        female: {
          pmt: {
            height: { min: 158, label: "Height (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1000, limitSeconds: 360, label: "1.0 Km Run", unit: "min:sec", placeholder: "06:00" }
          }
        }
      }
    }
  },
  rajasthan: {
    name: "Rajasthan Police",
    posts: {
      constable: {
        name: "Constable",
        male: {
          pmt: {
            height: { min: 168, label: "Height (cm)", unit: "cm" },
            chest: { min: 81, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 86, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 5000, limitSeconds: 1500, label: "5 Km Run", unit: "min:sec", placeholder: "25:00" }
          }
        },
        female: {
          pmt: {
            height: { min: 152, label: "Height (cm)", unit: "cm" },
            weight: { min: 47.5, label: "Weight (kg)", unit: "kg" }
          },
          pet: {
            run: { target: 5000, limitSeconds: 2100, label: "5 Km Run", unit: "min:sec", placeholder: "35:00" }
          }
        }
      },
      si: {
        name: "Sub-Inspector (SI)",
        male: {
          pmt: {
            height: { min: 168, label: "Height (cm)", unit: "cm" },
            chest: { min: 81, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 86, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 5000, limitSeconds: 1500, label: "5 Km Run", unit: "min:sec", placeholder: "25:00" }
          }
        },
        female: {
          pmt: {
            height: { min: 152, label: "Height (cm)", unit: "cm" },
            weight: { min: 47.5, label: "Weight (kg)", unit: "kg" }
          },
          pet: {
            run: { target: 5000, limitSeconds: 1800, label: "5 Km Run", unit: "min:sec", placeholder: "30:00" }
          }
        }
      }
    }
  },
  karnataka: {
    name: "Karnataka Police",
    posts: {
      constable: {
        name: "Constable",
        male: {
          pmt: {
            height: { min: 168, label: "Height (cm)", unit: "cm" },
            chest: { min: 81, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 86, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1600, limitSeconds: 390, label: "1.6 Km Run", unit: "min:sec", placeholder: "06:30" },
            longJump: { target: 12.46, label: "Long Jump (3.8m)", unit: "feet", placeholder: "12.5" },
            highJump: { target: 3.93, label: "High Jump (1.2m)", unit: "feet", placeholder: "3.9" },
            shotPut: { target: 18.37, label: "Shot Put (5.6m)", unit: "feet", placeholder: "18.4" }
          }
        },
        female: {
          pmt: {
            height: { min: 157, label: "Height (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 400, limitSeconds: 120, label: "400m Run", unit: "min:sec", placeholder: "02:00" },
            longJump: { target: 8.2, label: "Long Jump (2.5m)", unit: "feet", placeholder: "8.2" },
            highJump: { target: 2.95, label: "High Jump (0.9m)", unit: "feet", placeholder: "3.0" },
            shotPut: { target: 12.3, label: "Shot Put (3.75m)", unit: "feet", placeholder: "12.3" }
          }
        }
      },
      si: {
        name: "Sub-Inspector (SI)",
        male: {
          pmt: {
            height: { min: 170, label: "Height (cm)", unit: "cm" },
            chest: { min: 81, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 86, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1600, limitSeconds: 390, label: "1.6 Km Run", unit: "min:sec", placeholder: "06:30" },
            longJump: { target: 12.46, label: "Long Jump (3.8m)", unit: "feet", placeholder: "12.5" },
            highJump: { target: 3.93, label: "High Jump (1.2m)", unit: "feet", placeholder: "3.9" },
            shotPut: { target: 18.37, label: "Shot Put (5.6m)", unit: "feet", placeholder: "18.4" }
          }
        },
        female: {
          pmt: {
            height: { min: 157, label: "Height (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 400, limitSeconds: 120, label: "400m Run", unit: "min:sec", placeholder: "02:00" },
            longJump: { target: 8.2, label: "Long Jump (2.5m)", unit: "feet", placeholder: "8.2" },
            highJump: { target: 2.95, label: "High Jump (0.9m)", unit: "feet", placeholder: "3.0" },
            shotPut: { target: 12.3, label: "Shot Put (3.75m)", unit: "feet", placeholder: "12.3" }
          }
        }
      }
    }
  }
  ssc_gd: {
    name: "SSC GD",
    posts: {
      constable: {
        name: "Constable",
        male: {
          pmt: {
            height: { min: 170, label: "Height (cm)", unit: "cm" },
            chest: { min: 80, label: "Chest (cm)", unit: "cm" },
            chestExpanded: { min: 85, label: "Chest Expanded (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 5000, limitSeconds: 1440, label: "5 km Run", unit: "min:sec", placeholder: "24:00" },
            longJump: { target: 12.0, label: "Long Jump", unit: "feet", placeholder: "12.0" },
            highJump: { target: 3.5, label: "High Jump", unit: "feet", placeholder: "3.5" }
          }
        },
        female: {
          pmt: {
            height: { min: 157, label: "Height (cm)", unit: "cm" }
          },
          pet: {
            run: { target: 1600, limitSeconds: 510, label: "1.6 km Run", unit: "min:sec", placeholder: "08:30" },
            longJump: { target: 10.0, label: "Long Jump", unit: "feet", placeholder: "10.0" },
            highJump: { target: 3.0, label: "High Jump", unit: "feet", placeholder: "3.0" }
          }
        }
      }
    }
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = STATE_STANDARDS;
}
