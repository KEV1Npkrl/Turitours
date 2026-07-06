package com.turitours.backend.util;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class JsonUtil {

    public static String getString(Map<String, Object> map, String key) {
        if (map == null || !map.containsKey(key) || map.get(key) == null) {
            return null;
        }
        return map.get(key).toString();
    }

    public static Integer getInt(Map<String, Object> map, String key) {
        String val = getString(map, key);
        if (val == null || val.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(val);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static BigDecimal getBigDecimal(Map<String, Object> map, String key) {
        String val = getString(map, key);
        if (val == null || val.trim().isEmpty()) {
            return null;
        }
        try {
            return new BigDecimal(val);
        } catch (Exception e) {
            return null;
        }
    }

    public static LocalDate getLocalDate(Map<String, Object> map, String key) {
        String val = getString(map, key);
        if (val == null || val.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(val);
        } catch (Exception e) {
            return null;
        }
    }

    public static Boolean getBoolean(Map<String, Object> map, String key) {
        if (map == null || !map.containsKey(key) || map.get(key) == null) {
            return null;
        }
        if (map.get(key) instanceof Boolean) {
            return (Boolean) map.get(key);
        }
        String val = map.get(key).toString();
        return Boolean.parseBoolean(val);
    }
}
